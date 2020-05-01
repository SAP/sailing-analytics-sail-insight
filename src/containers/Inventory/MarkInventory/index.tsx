import { __, always, compose, concat, defaultTo, map, merge, reduce } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect,
  recomposeLifecycle as lifeCycle,
  recomposeWithState as withState
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity, forwardingPropsFlatList } from 'components/fp/react-native'
import { ControlPointClass } from 'models/Course'

import { getMarkProperties } from 'selectors/inventory'
import { deleteMarkProperties, loadMarkProperties } from 'actions/inventory'

import Images from '@assets/Images'
import IconText from 'components/IconText'
import { Alert } from 'react-native'
import styles from './styles'
import I18n from 'i18n'

const withLoadingOfMarkProperties = compose(
  withState('markPropertiesLoaded', 'setMarkPropertiesLoaded', false),
  lifeCycle({
    componentDidMount() {
      this.props.navigation.addListener('focus',
        () => {
          !this.props.markPropertiesLoaded && this.props.loadMarkProperties()
          this.props.setMarkPropertiesLoaded(true)
        })
    }
  }))

const mapStateToProps = (state, props) => ({
  markProperties: getMarkProperties(state)
})

const icon = compose(
  fromClass(IconText).contramap,
  always)

const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markIcon = icon({ source: Images.courseConfig.markPortIcon, iconStyle: { width: 80, height: 80 } })
const markIconSmall = icon({ source: Images.markInventory.markIcon, width: 40, height: 40, iconStyle: { width: 40, height: 40 } })

const ControlPointClassSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      style: styles.createNewClassSelectorItem,
      onPress: (props: any) => {}/*props.assignControlPointClass(props.class)*/ }),
    view({}),
    concat(__, text({ style: styles.createNewClassSelectorItemText }, props.label)))(
    props.icon))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.createNewContainer }),
    concat(text({ style: styles.createNewTitle }, I18n.t('text_temporary_mark_inventory'))),
    always(nothing()),
    view({ style: styles.createNewClassContainer }),
    reduce(concat, nothing()),
    map(compose(ControlPointClassSelectorItem.contramap, merge)))([
    { ['class']: ControlPointClass.MarkPair, icon: gateIcon, label: 'Line/Gate' },
    { ['class']: ControlPointClass.Mark, icon: markIcon, label: 'Mark' }]))

const MarkPropertiesItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => {
        Alert.alert(
          '',
          'Decide for an action',
          [
            //{ text: 'Edit mark' },
            //{ text: 'Share mark' },
            { text: 'Delete mark', onPress: () => {
              Alert.alert('Deleting Mark', `Do you really want to irretrievably delete ${props.item.name}?`, [
                { text: 'Yes', onPress: () => props.deleteMarkProperties(props.item) },
                { text: 'No' },
              ])
            }},
            { text: 'Cancel' },
          ])
      }
    }),
    view({ style: styles.markContainer }),
    reduce(concat, nothing()))([
    markIconSmall,
    text({ style: styles.markShortName }, `(${defaultTo('', props.item.shortName)})`),
    text({ style: styles.markName }, defaultTo('', props.item.name)),
    text({ style: styles.markEllipses }, '...')]))

const List = Component((props: object) => compose(
  fold(props),
  view({ style: styles.markListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.markProperties,
      renderItem: MarkPropertiesItem.fold,
    }, props))))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { deleteMarkProperties, loadMarkProperties }),
    withLoadingOfMarkProperties,
    scrollView({ style: styles.mainContainer }),
    concat(text({ style: styles.title }, 'MARK INVENTORY')),
    concat(CreateNewSelector))(
    List))
