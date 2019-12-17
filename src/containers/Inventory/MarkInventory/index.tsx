import { __, compose, always, objOf,
  prop, map, reduce, concat, merge, defaultTo,
  partition, flatten, reverse, includes, sortBy,
  when, equals, indexOf, addIndex } from 'ramda'
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
import { getMarkProperties } from 'selectors/inventory'
import { loadMarkProperties, deleteMarkProperties } from 'actions/inventory'
import { Alert } from 'react-native'
import styles from './styles'
import IconText from 'components/IconText'
import Images from '@assets/Images'

const mapIndexed = addIndex(map)

const startFinishMarks = ['Start/Finish Pin', 'Start/Finish Boat', 'Start Pin', 'Start Boat', 'Finish Pin', 'Finish Boat']

const mapStateToProps = state => ({
  markProperties: compose(
    flatten,
    reverse,
    mapIndexed((set, index) =>
      when(
        always(equals(0, index)),
        sortBy(compose(indexOf(__, startFinishMarks), prop('name'))),
        set)),
    partition(compose(includes(__, startFinishMarks), prop('name'))),
    getMarkProperties)(
    state)
})

const withLoadingMarks = lifeCycle({
  componentDidMount() { this.props.loadMarkProperties() }
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

const MarkPropertiesItem = Component((props: object) =>
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
                { text: 'Yes', onPress: () => props.deleteMarkProperties(props.item) },
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
    text({ style: styles.markShortName }, `(${defaultTo('', props.item.shortName)})`),
    text({ style: styles.markName }, defaultTo('', props.item.name)),
    text({ style: styles.markEllipses }, '...')]))

const List = Component((props: object) => compose(
  fold(props),
  view({ style: styles.markListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.markProperties,
      renderItem: MarkPropertiesItem.fold
    }, props))))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { loadMarkProperties, deleteMarkProperties }),
    withLoadingMarks,
    scrollView({ style: styles.mainContainer }),
    concat(text({ style: styles.title }, 'MARK INVENTORY')),
    concat(CreateNewSelector),
    concat(List))(
    nothing()))
