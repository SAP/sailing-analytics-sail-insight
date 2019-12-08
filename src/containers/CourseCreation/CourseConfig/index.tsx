import { __, compose, always, both, path, when, move, length,
  prop, map, reduce, concat, merge, defaultTo, any, take,
  objOf, isNil, not, equals, pick, tap, ifElse, insert, complement, uncurryN,
  propEq, addIndex, intersperse, gt, findIndex } from 'ramda'
import {
  Component, fold, fromClass, nothing, nothingAsClass,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity } from 'components/fp/react-native'
import { Switch } from 'react-native'
import uuidv4 from 'uuid/v4'

import { ControlPointClass, MarkPositionType, PassingInstruction } from 'models/Course'

import { selectWaypoint, removeWaypoint, addWaypoint, toggleSameStartFinish,
  selectMarkConfiguration, updateControlPointName, updateControlPointShortName,
  updateMarkConfigurationName, updateMarkConfigurationShortName,
  updateControlPointPassingInstruction } from 'actions/courses'
import { getSelectedWaypoint, waypointLabel, getMarkPropertiesByMarkConfiguration,
  getSameStartFinish, getEditedCourse, getCourseLoading,
  getSelectedMarkConfiguration, getSelectedMarkProperties } from 'selectors/course'

import { navigateToCourseGeolocation, navigateToCourseTrackerBinding } from 'navigation'
import { coordinatesToString } from 'helpers/utils'

import TextInput from 'components/TextInput'
import SwitchSelector from 'react-native-switch-selector'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import Dash from 'react-native-dash'

import EStyleSheets from 'react-native-extended-stylesheet'
import styles from './styles'

import { $MediumBlue, $Orange, $DarkBlue, $LightDarkBlue } from 'styles/colors'

const mapIndexed = addIndex(map)

const mapStateToProps = (state: any, props: any) => ({
  course: getEditedCourse(state),
  loading: getCourseLoading(state),
  selectedWaypoint: getSelectedWaypoint(state),
  selectedMarkConfiguration: getSelectedMarkConfiguration(state),
  selectedMarkProperties: getSelectedMarkProperties(state),
  waypointLabel: uncurryN(2, waypointLabel)(__, state),
  markPropertiesByMarkConfiguration: uncurryN(2, getMarkPropertiesByMarkConfiguration)(__, state),
  sameStartFinish: getSameStartFinish(state),
  inventory: [],//getMarkInventory(state)
})

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const nothingIfLoading = branch(isLoading, nothingAsClass)
const nothingIfNotLoading = branch(isNotLoading, nothingAsClass)
const isGateWaypoint = compose(equals(2), length, defaultTo([]), path(['selectedWaypoint', 'markConfigurationIds']))
const isEmptyWaypoint = compose(isNil, path(['selectedWaypoint', 'markConfigurationIds']))
const isWaypointSelected = (waypoint: any, props: any) => props.selectedWaypoint && props.selectedWaypoint.id === waypoint.id
const isStartOrFinishGate = both(isGateWaypoint,
  props => compose(
    any(compose(equals(props.selectedWaypoint.id), prop('id'))),
    take(2),
    move(-1, 0))(
    props.course.waypoints))

const formHasPositionType = (type: string) => compose(propEq('positionType', type), defaultTo({}), path(['input', 'value']))
const formHasGeolocation = formHasPositionType(MarkPositionType.Geolocation)
const formHasTracking = formHasPositionType(MarkPositionType.TrackingDevice)

const geolocationAsString = compose(coordinatesToString, path(['input', 'value']))

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenSelectedWaypoint = branch(compose(not, isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenGate = branch(isGateWaypoint, nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingWhenEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingWhenNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)
const nothingWhenNotSelected = branch(compose(isNil, prop('selected')), nothingAsClass)

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)

const icon = compose(
  fromClass(IconText).contramap,
  always)

const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markIcon = icon({ source: Images.courseConfig.markIcon, iconStyle: { width: 80, height: 80 } })
const deleteIcon = icon({ source: Images.courseConfig.deleteIcon, iconStyle: { width: 13, height: 13 } })
const roundingLeftIcon = icon({ source: Images.courseConfig.roundingDirectionLeft })
const roundingRightIcon = icon({ source: Images.courseConfig.roundingDirectionRight })
const gatePassingIcon = icon({ source: Images.courseConfig.gatePassing, iconStyle: { width: 35, height: 35 } })
const linePassingIcon = icon({ source: Images.courseConfig.linePassing, iconStyle: { width: 30, height: 30 } })
const trackerIcon = icon({ source: Images.courseConfig.tracker, iconStyle: { width: 11, height: 11 } })
const locationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 11, height: 11 } })
const bigLocationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 25, height: 25 } })
const arrowUp = ({ color = $LightDarkBlue }: any = {}) => icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: 25 },
  iconStyle: { height: 12, tintColor: color } })

const plusIcon = icon({
  source: Images.actions.add,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center' }
})

const dashLine = fromClass(Dash).contramap(always({
  style: { height: 50, width: 90, alignItems: 'center' },
  dashColor: 'white'
}))

const GateMarkSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.gateMarkSelectorItemContainer }),
    concat(__, nothingWhenNotSelected(arrowUp())),
    touchableOpacity({
      style: [ styles.gateMarkSelectorItem, props.selected ? styles.gateMarkSelectorItemSelected : null ],
      onPress: (props: any) => props.selectMarkConfiguration(props.markConfigurationId) }),
    text({ style: styles.gateMarkSelectorText }),
    defaultTo(''),
    prop('shortName'),
    props.markPropertiesByMarkConfiguration)(
    props.markConfigurationId))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
    concat(text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Defining gate marks')),
    view({ style: styles.gateMarkSelectorContainer }),
    reduce(concat, nothing()),
    intersperse(dashLine),
    map(compose(
      GateMarkSelectorItem.contramap,
      merge,
      when(propEq('markConfigurationId', props.selectedMarkConfiguration), merge({ selected: true })),
      objOf('markConfigurationId'))),
    defaultTo([]),
    path(['selectedWaypoint', 'markConfigurationIds']))(
    props))

const SameStartFinish = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.sameStartFinishContainer }),
    reduce(concat, nothing()))([
    fromClass(Switch).contramap(merge({
      value: props.sameStartFinish,
      onValueChange: props.toggleSameStartFinish,
      trackColor: { false: 'gray', true: 'white' },
      thumbColor: 'white'
    })),
    text({ style: styles.sameStartFinishText }, 'Start & finish are the same')
  ]))

const MarkPositionTracking = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(text({ style: styles.trackingText }, formHasTracking(props) ? 'tracking device info' : 'No device tracked')),
    touchableOpacity({
      onPress: navigateToCourseTrackerBinding
    }))(
    text({ style: styles.trackingText }, 'Change Tracking Device')))

const MarkPositionPing = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    style: styles.pingPositionButton,
    onPress: (props: object) => navigator.geolocation.getCurrentPosition(compose(
      props.input.onChange,
      merge({ positionType: MarkPositionType.Geolocation }),
      pick(['latitude', 'longitude']),
      prop('coords')))
  }))(
  text({ style: [styles.locationText, styles.pingText] }, 'PING POSITION')))

const MarkPositionCoordinates = Component(props => compose(
  fold(props),
  view({ style: styles.coordinatesContainer }),
  concat(bigLocationIcon),
  text({ style: styles.coordinatesText }),
  ifElse(formHasGeolocation, geolocationAsString, always('')))(
  props))

const MarkPositionGeolocation = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(MarkPositionCoordinates),
    concat(MarkPositionPing),
    touchableOpacity({
      style: styles.editPositionButton,
      onPress: () => navigator.geolocation.getCurrentPosition(({ coords }) =>
        navigateToCourseGeolocation({ currentPosition: coords })) }))(
    text({ style: styles.locationText }, 'Edit Position')))

const locationTypes = [
  { value: MarkPositionType.TrackingDevice, label: 'TRACKER', customIcon: trackerIcon.fold },
  { value: MarkPositionType.Geolocation, label: 'LOCATION', customIcon: locationIcon.fold }]

const PositionSelector = fromClass(SwitchSelector).contramap((props: any) => ({
  options: locationTypes,
  initial: compose(
    when(gt(0), always(0)),
    findIndex(i => i.value === props.selectedPositionType))(
    locationTypes),
  onPress: props.setSelectedPositionType,
  backgroundColor: $MediumBlue,
  selectedColor: 'white',
  buttonColor: $Orange,
  textColor: 'white',
  borderColor: 'white',
  borderRadius: 2,
  hasPadding: true,
  height: 55,
  textStyle: styles.locationSwitchText
}))

const MarkPosition = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Locate or track'),
      PositionSelector,
      arrowUp({color: $DarkBlue }),
      nothingWhenNotTrackingSelected(MarkPositionTracking),
      nothingWhenNotGeolocationSelected(MarkPositionGeolocation)
    ]))

const Appearance = Component((props: object) =>
  compose(
    fold(props))(
    text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Appearance')))

const DeleteButton = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.deleteWaypointContainer }),
    touchableOpacity({ onPress: (props: any) =>
      props.removeWaypoint({ id: props.selectedWaypoint.id }) }),
    view({ style: styles.deleteWaypointButton }),
    concat(deleteIcon))(
    text({ style: styles.deleteButtonText }, 'Delete this mark from course')))

const ControlPointClassSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPointClass(props.class) }))(
    props.icon))

const InventoryItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      style: styles.inventoryItem,
      onPress: (props: any) => props.assignControlPoint(props.item) }),
    text({ style: styles.inventoryItemText }))(
    props.item.longName))

const InventoryList = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.inventoryList }),
    reduce(concat, nothing()),
    map(compose(InventoryItem.contramap, merge, objOf('item'))))(
    props.inventory))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.createNewContainer }),
    concat(text({ style: styles.createNewTitle }, 'Create new')),
    concat(__, InventoryList),
    view({ style: styles.createNewClassContainer }),
    reduce(concat, nothing()),
    map(compose(ControlPointClassSelectorItem.contramap, merge)))([
    { ['class']: ControlPointClass.MarkPair, icon: gateIcon },
    { ['class']: ControlPointClass.Mark, icon: markIcon }]))

const TextInputWithLabel = Component((props: any) => compose(
  fold(props),
  view({ style: props.isShort ? { flexBasis: 10 } : { flexBasis: 50 }}),
  concat(__, fromClass(TextInput)),
  text({ style: styles.textInputLabel, numberOfLines: 1 }))(
  props.inputLabel))

const gateNameInputData = props => [
  { inputLabel: 'Name',
    value: props.selectedWaypoint.controlPointName,
    onChangeText: (value: string) => props.updateControlPointName({
      id: props.selectedWaypoint.id,
      value
    })
  },
  { inputLabel: 'Short Name',
    value: props.selectedWaypoint.controlPointShortName,
    onChangeText: (value: string) => props.updateControlPointShortName({
      id: props.selectedWaypoint.id,
      value
    }) } ]

const markNamesInputData = props => [
  { inputLabel: 'Name',
    value: props.selectedMarkProperties.name,
    onChangeText: (value: string) => props.updateMarkConfigurationName({
      id: props.selectedMarkConfiguration,
      value
    })
  },
  { inputLabel: 'Short Name',
    value: props.selectedMarkProperties.shortName,
    onChangeText: (value: string) => props.updateMarkConfigurationShortName({
      id: props.selectedMarkConfiguration,
      value
    }) }]

const ShortAndLongName = Component((props: object) =>
  compose(
    fold(props),
    view({ style: { flexDirection: 'row' }, key: props.selectedWaypoint.id }),
    reduce(concat, nothing()),
    mapIndexed((data, index) => compose(
      view({ style: index === 1 ? { marginLeft: 30 } : { flex: 1, flexBasis: 1 }}),
      compose(TextInputWithLabel.contramap, merge),
      merge({
        maxLength: index === 1 ? 5 : 100,
        inputStyle: styles.textInput,
        inputContainerStyle: styles.textInputContainer,
        containerStyle: styles.textInputInputContainer }))(data)))(
    props.items))

const PassingInstructionItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: (props: any) => props.updateControlPointPassingInstruction({ id: props.selectedWaypoint.id, value: props.type }),
      style: [
        styles.passingInstruction,
        props.selected ? styles.selectedPassingInstruction : '' ]}))(
    props.icon))

const singleMarkPassingInstructions = [
  { type: PassingInstruction.Port, icon: roundingLeftIcon },
  { type: PassingInstruction.Starboard, icon: roundingRightIcon }]

const gatePassingInstructions = [
  { type: PassingInstruction.Gate, icon: gatePassingIcon },
  { type: PassingInstruction.Line, icon: linePassingIcon }]

const PassingInstructions = Component((props: object) =>
  compose(
    fold(props),
    concat(text(
      { style: [styles.sectionTitle, styles.indentedSectionTitle] },
      isGateWaypoint(props) ? 'Passing Gate' : 'Rounding direction')),
    view({ style: styles.passingInstructionContainer }),
    reduce(concat, nothing()),
    map(compose(
      PassingInstructionItem.contramap,
      merge,
      when(propEq('type', props.selectedWaypoint.passingInstruction), merge({ selected: true })))),
    ifElse(isGateWaypoint, always(gatePassingInstructions), always(singleMarkPassingInstructions)))(
    props))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.editContainer, !isGateWaypoint(props) && styles.indentedContainer ] }),
    concat(compose(
      view({ style: isGateWaypoint(props) && styles.indentedContainer }),
      reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(nothingWhenNotStartOrFinishGate(SameStartFinish)),
      nothingWhenNotAGate(nothingWhenEmptyWaypoint(ShortAndLongName.contramap(merge({ items: gateNameInputData(props) })))),
      nothingWhenStartOrFinishGate(nothingWhenNotAGate(nothingWhenEmptyWaypoint(PassingInstructions))),
      nothingWhenEmptyWaypoint(nothingWhenNotAGate(GateMarkSelector))
    ])),
    when(always(isGateWaypoint(props)), view({ style: styles.gateEditContainer })),
    reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(ShortAndLongName.contramap(merge({ items: markNamesInputData(props) }))),
      nothingWhenGate(nothingWhenEmptyWaypoint(PassingInstructions)),
      nothingWhenEmptyWaypoint(MarkPosition),
      nothingWhenEmptyWaypoint(Appearance),
      nothingWhenNotEmptyWaypoint(CreateNewSelector),
      nothingWhenStartOrFinishGate(DeleteButton)
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      style: styles.addButton,
      onPress: (props: any) =>
        props.addWaypoint({ index: props.index, id: uuidv4() })
     }))(
    plusIcon))

const waypointItemToComponent = (waypoint: any, index: number, list: any[]) => Component((props: any) => compose(
  fold(props),
  when(always(isWaypointSelected(waypoint, props)),
    index === list.length - 1 ?
      concat(AddButton.contramap(merge({ index }))) :
      concat(__, AddButton.contramap(merge({ index: index + 1 })))),
  touchableOpacity({
    onPress: (props: any) => props.selectWaypoint(waypoint.id),
    style: [
      EStyleSheets.child(styles, 'waypointContainer', index, list.length),
      isWaypointSelected(waypoint, props) && styles.selectedWaypoint
    ]
  }),
  text({ style: styles.waypointText }))(
  props.waypointLabel(waypoint)))

const WaypointsList = Component(props => compose(
  fold(props),
  scrollView({ style: styles.waypointsContainer, horizontal: true }),
  reduce(concat, nothing()),
  insert(props.course.waypoints.length - 1,
    nothingWhenSelectedWaypoint(AddButton.contramap(merge({ index: props.course.waypoints.length - 1 })))),
  mapIndexed(waypointItemToComponent),
  path(['course', 'waypoints']))(
  props))

const LoadingIndicator = text({}, 'Loading ...')

export default Component((props: object) =>
  compose(
    fold(props),
    withSelectedPositionType,
    connect(mapStateToProps, {
      selectWaypoint, removeWaypoint, selectMarkConfiguration, addWaypoint,
      toggleSameStartFinish, updateControlPointName, updateControlPointShortName,
      updateMarkConfigurationName, updateMarkConfigurationShortName, updateControlPointPassingInstruction }),
    scrollView({ style: styles.mainContainer, vertical: true }),
    reduce(concat, nothing()))(
    [nothingIfNotLoading(LoadingIndicator),
     nothingIfLoading(WaypointsList),
     nothingIfLoading(nothingWhenNoSelectedWaypoint(WaypointEditForm)) ]))
