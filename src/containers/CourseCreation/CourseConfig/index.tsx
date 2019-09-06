import { __, compose, always, both, path, when, append, zipWith,
  prop, map, reduce, concat, merge, props as rProps, defaultTo,
  objOf, isNil, not, either, equals, pick, tap, ifElse,
  propEq, addIndex, mergeLeft, intersperse, gt, findIndex } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState,
  recomposeMapProps as mapProps
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity } from 'components/fp/react-native'

import { Switch } from 'react-native'

import { field as reduxFormField, reduxForm, formSection } from 'components/fp/redux-form'

import {
  courseConfigCommonFormSettings,
  FORM_PASSING_INSTRUCTION,
  FORM_MARK_SHORT_NAME,
  FORM_MARK_LONG_NAME,
  FORM_MARK_PAIR_SHORT_NAME,
  FORM_MARK_PAIR_LONG_NAME,
  FORM_LOCATION,
  formMarkSectionNameByGateSide,
  getFormInitialValues
} from 'forms/courseConfig'
import { ControlPointClass, GateSide, MarkPositionType, PassingInstruction } from 'models/Course'

import { selectWaypoint, removeWaypoint, selectGateSide, addWaypoint,
  assignControlPointClass, assignControlPoint, saveWaypointFromForm } from 'actions/courses'
import { getSelectedWaypoint, getSelectedMark, getSelectedGateSide, getMarkInventory } from 'selectors/course'

import { navigateToCourseGeolocation, navigateToCourseTrackerBinding } from 'navigation'

import { coordinatesToString } from 'helpers/utils'

import FormTextInput from 'components/form/FormTextInput'
import SwitchSelector from 'react-native-switch-selector'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import Dash from 'react-native-dash'

import EStyleSheets from 'react-native-extended-stylesheet'
import styles from './styles'

import { $MediumBlue, $Orange, $DarkBlue } from 'styles/colors'

const mapIndexed = addIndex(map)

const controlPointClassToLabel = {
  [ControlPointClass.MarkPair]: 'Gate/Line',
  [ControlPointClass.Mark]: 'Mark'
}

const mapInitialValuesToProps = (state: any, props: any) => ({
    initialValues: getFormInitialValues(state)
  })

const mapStateToProps = (state: any, props: any) => ({
      selectedWaypoint: getSelectedWaypoint(state),
      selectedMark: getSelectedMark(state),
      selectedGateSide: getSelectedGateSide(state),
      inventory: getMarkInventory(state),
      // required for properly updating the redux form fields
      key: getSelectedGateSide(state) })

const waypointClass = path(['waypoint', 'controlPoint', 'class'])
const isGateWaypoint = compose(equals(ControlPointClass.MarkPair), waypointClass)
const isEmptyWaypoint = compose(isNil, path(['waypoint', 'controlPoint']))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('waypoint')))
const isWaypointSelected = (waypoint: any, props: any) => props.selectedWaypoint && props.selectedWaypoint.id === waypoint.id

const formHasPositionType = (type: string) => compose(propEq('positionType', type), defaultTo({}), path(['input', 'value']))
const formHasGeolocation = formHasPositionType(MarkPositionType.Geolocation)
const formHasTracking = formHasPositionType(MarkPositionType.TrackingDevice)

const geolocationAsString = compose(coordinatesToString, path(['input', 'value']))

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingWhenEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingWhenNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)
const nothingWhenFormHasTracking = branch(formHasTracking, nothingAsClass)
const nothingWhenPristineForm = branch(propEq('pristine', true), nothingAsClass)
const nothingWhenNotSelected = branch(compose(isNil, prop('selected')), nothingAsClass)

const selectedWaypointAsWaypoint = mapProps(props => ({ ...props, waypoint: props.selectedWaypoint }))

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)

const icon = compose(
  fromClass(IconText).contramap,
  always)

const deleteIcon = icon({ source: Images.courseConfig.deleteIcon, iconStyle: { width: 13, height: 13 } })
const roundingLeftIcon = icon({ source: Images.courseConfig.roundingDirectionLeft })
const roundingRightIcon = icon({ source: Images.courseConfig.roundingDirectionRight })
const gatePassingIcon = icon({ source: Images.courseConfig.gatePassing, iconStyle: { width: 35, height: 35 } })
const linePassingIcon = icon({ source: Images.courseConfig.linePassing, iconStyle: { width: 30, height: 30 } })
const trackerIcon = icon({ source: Images.courseConfig.tracker, iconStyle: { width: 11, height: 11 } })
const locationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 11, height: 11 } })
const bigLocationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 25, height: 25 } })
const arrowUp = ({ color = $MediumBlue }: any = {}) => icon({
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
      onPress: (props: any) => props.selectGateSide(props.side) }),
    text({ style: styles.gateMarkSelectorText }),
    defaultTo(props.side))(
    props.mark && props.mark.shortName))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
    concat(text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Defining gate marks')),
    view({ style: styles.gateMarkSelectorContainer }),
    reduce(concat, nothing()),
    intersperse(dashLine),
    map(compose(GateMarkSelectorItem.contramap, merge)),
    map(when(compose(equals(props.selectedGateSide), prop('side')), merge({ selected: true }))),
    zipWith(merge, [{ side: GateSide.LEFT }, { side: GateSide.RIGHT }]),
    map(objOf('mark')),
    rProps(['leftMark', 'rightMark']),
    path(['selectedWaypoint', 'controlPoint']))(
    props))

const SameStartFinish = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, 'Start/Finish are the same'),
    fromClass(Switch)
  ]))

const toLocationFormField = (component: any) => Component((props: object) =>
  compose(
    fold(props),
    formSection({ name: formMarkSectionNameByGateSide(props.selectedGateSide) }))(
    reduxFormField({
      name: FORM_LOCATION,
      component: component.contramap(merge(props)).fold
    })))

const MarkPositionTracking = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(text({ style: styles.trackingText }, formHasTracking(props) ? 'tracking device info' : 'No device tracked')),
    touchableOpacity({
      onPress: () => navigateToCourseTrackerBinding({
        formSectionName: formMarkSectionNameByGateSide(props.selectedGateSide) })
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
  ifElse(formHasGeolocation, geolocationAsString, always('')))(props))

const MarkPositionGeolocation = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(MarkPositionCoordinates),
    concat(MarkPositionPing),
    touchableOpacity({
      style: styles.editPositionButton,
      onPress: () => navigateToCourseGeolocation({
        formSectionName: formMarkSectionNameByGateSide(props.selectedGateSide) }) }))(
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
      nothingWhenNotTrackingSelected(toLocationFormField(MarkPositionTracking)),
      nothingWhenNotGeolocationSelected(toLocationFormField(MarkPositionGeolocation))
    ]))

const Appearance = Component((props: object) =>
  compose(
    fold(props))(
    text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Appearance')))

const DeleteButton = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.deleteWaypointContainer }),
    touchableOpacity({ onPress: (props: any) => props.removeWaypoint() }),
    view({ style: styles.deleteWaypointButton }),
    concat(deleteIcon))(
    text({ style: styles.deleteButtonText }, 'Delete this mark from course')))

const ControlPointClassSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPointClass(props.class) }),
    text({}),
    prop(__, controlPointClassToLabel))(
    props.class))

const InventoryItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPoint(props.item) }),
    text({}))(
    props.item.longName))

const InventoryList = Component((props: object) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()),
    map(compose(InventoryItem.contramap, merge, objOf('item'))))(
    props.inventory))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({}),
    concat(text({}, 'CREATE NEW')),
    reduce(concat, nothing()),
    append(InventoryList),
    map(compose(ControlPointClassSelectorItem.contramap, merge, objOf('class'))))([
    ControlPointClass.MarkPair,
    ControlPointClass.Mark ]))

const FormTextInputWithLabel = Component((props: any) => compose(
  fold(props),
  view({ style: props.isShort ? { flexBasis: 10 } : { flexBasis: 50 }}),
  concat(__, fromClass(FormTextInput)),
  text({ style: styles.textInputLabel }))(
  props.inputLabel))

const gateNameInputData = [
  { name: FORM_MARK_PAIR_LONG_NAME, inputLabel: 'Name' },
  { name: FORM_MARK_PAIR_SHORT_NAME, inputLabel: 'Short Name' } ]

const markNamesInputData = [
  { name: FORM_MARK_LONG_NAME, inputLabel: 'Name' },
  { name: FORM_MARK_SHORT_NAME, inputLabel: 'Short Name' }]

const ShortAndLongName = Component((props: object) =>
  compose(
    fold(props),
    when(always(compose(not, isNil)(props.formSection)), formSection(props.formSection)),
    view({ style: { flexDirection: 'row' } }),
    reduce(concat, nothing()),
    mapIndexed((props, index) => compose(
      view({ style: index === 1 ? { width: 100, marginLeft: 30 } : { flex: 1 }}),
      reduxFormField,
      merge({
        component: FormTextInputWithLabel.fold,
        inputStyle: styles.textInput,
        inputContainerStyle: styles.textInputContainer,
        containerStyle: styles.textInputInputContainer }))(props)))(
    props.items))

const PassingInstructionItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: (props: any) => props.input.onChange(props.type),
      style: [
        styles.passingInstruction,
        props.input.value === props.type ? styles.selectedPassingInstruction : '' ]}))(
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
    concat(text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, isGateWaypoint(props) ? 'Passing Gate' : 'Rounding direction')),
    view({ style: styles.passingInstructionContainer }),
    reduce(concat, nothing()),
    map(compose(
      reduxFormField,
      mergeLeft({
        name: FORM_PASSING_INSTRUCTION,
        component: PassingInstructionItem.fold
      }))),
    ifElse(isGateWaypoint, always(gatePassingInstructions), always(singleMarkPassingInstructions)))(
    props))

const CancelButton = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.reset() }),
    text({}))(
    'Cancel'))

const SaveButton = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: props.handleSubmit(props.saveWaypointFromForm) }),
    text({}))(
    'Save'))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.editContainer, !isGateWaypoint(props) && styles.indentedContainer ] }),
    concat(compose(
      view({ style: isGateWaypoint(props) && styles.indentedContainer }),
      reduce(concat, nothing()))([
      nothingWhenNotStartOrFinishGate(SameStartFinish),
      nothingWhenEmptyWaypoint(ShortAndLongName.contramap(merge({ items: gateNameInputData }))),
      nothingWhenEmptyWaypoint(PassingInstructions),
      nothingWhenNotAGate(GateMarkSelector)
    ])),
    when(always(isGateWaypoint(props)), view({ style: styles.gateEditContainer })),
    reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(ShortAndLongName.contramap((props: any) => merge({
        items: markNamesInputData,
        formSection: { name: formMarkSectionNameByGateSide(props.selectedGateSide) } }, props))),
      nothingWhenEmptyWaypoint(MarkPosition),
      nothingWhenEmptyWaypoint(Appearance),
      nothingWhenNotEmptyWaypoint(CreateNewSelector),
      nothingWhenPristineForm(CancelButton),
      nothingWhenPristineForm(SaveButton),
      nothingWhenStartOrFinishGate(DeleteButton)
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      style: styles.addButton,
      onPress: (props: any) => props.addWaypoint(props.index),
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
  text({ style: styles.waypointText }),
  defaultTo('\u2022'),
  path(['controlPoint', index === 0 || index === list.length - 1 ? 'longName' : 'shortName']))(
  waypoint))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapInitialValuesToProps),
    reduxForm(courseConfigCommonFormSettings),
    withSelectedPositionType,
    connect(mapStateToProps, {
      selectWaypoint, removeWaypoint, selectGateSide, saveWaypointFromForm,
      addWaypoint, assignControlPointClass, assignControlPoint }),
    view({ style: styles.mainContainer }),
    concat(__, nothingWhenNoSelectedWaypoint(selectedWaypointAsWaypoint(WaypointEditForm))),
    scrollView({ style: styles.waypointsContainer, horizontal: true }),
    reduce(concat, nothing()),
    mapIndexed(waypointItemToComponent))(
    props.course.waypoints))
