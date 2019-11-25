import { __, compose, always, objOf,
  prop, map, reduce, concat, merge } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect,
  recomposeLifecycle as lifeCycle
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity, forwardingPropsFlatList } from 'components/fp/react-native'
import { ControlPointClass } from 'models/Course'

import { getMarks } from 'selectors/mark'
import { loadMarkInventory, deleteMark } from 'actions/inventory'

import { Alert } from 'react-native'
import styles from './styles'
import IconText from 'components/IconText'
import Images from '@assets/Images'

const mapStateToProps = (state, props) => ({
  marks: getMarks(state)
})

const withLoadingMarks = lifeCycle({
  componentDidMount() { this.props.loadMarkInventory() }
})

const icon = compose(
  fromClass(IconText).contramap,
  always)

const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markIcon = icon({ source: Images.courseConfig.markIcon, iconStyle: { width: 80, height: 80 } })
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
    concat(text({ style: styles.createNewTitle }, 'Create new')),
    view({ style: styles.createNewClassContainer }),
    reduce(concat, nothing()),
    map(compose(ControlPointClassSelectorItem.contramap, merge)))([
    { ['class']: ControlPointClass.MarkPair, icon: gateIcon, label: 'Line/Gate' },
    { ['class']: ControlPointClass.Mark, icon: markIcon, label: 'Mark' }]))

const MarkItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => {
        Alert.alert(
          '',
          'Decide for an action',
          [
            { text: 'Edit mark'},
            { text: 'Share mark'},
            { text: 'Delete mark', onPress: () => {
              Alert.alert('Deleting Mark', `Do you really want to irretrievably delete ${props.item.name}?`, [
                { text: 'Yes', onPress: () => props.deleteMark(props.item) },
                { text: 'No' }
              ])
            }},
            { text: 'Cancel' }
          ])
      }
    }),
    view({ style: styles.markContainer }),
    reduce(concat, nothing()))([
    markIconSmall,
    text({ style: styles.markShortName }, `(${props.item.shortName})`),
    text({ style: styles.markName }, props.item.name),
    text({ style: styles.markEllipses }, '...')]))

const List = Component((props: object) => compose(
  fold(props),
  view({ style: styles.markListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.marks,
      renderItem: MarkItem.fold
    }, props))))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { loadMarkInventory, deleteMark }),
    withLoadingMarks,
    scrollView({ style: styles.mainContainer }),
    concat(text({ style: styles.title }, 'MARK INVENTORY')),
    concat(CreateNewSelector),
    concat(List))(
    nothing()))
