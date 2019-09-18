import { __, compose, always, both, path, when, append, zipWith,
  prop, map, reduce, concat, merge, props as rProps, defaultTo,
  objOf, insert, isNil, not, either, equals, pick, tap, ifElse,
  propEq, addIndex, mergeLeft, intersperse, prepend } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  contramap,
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
  FORM_WAYPOINT_SECTION_NAME,
  FORM_PASSING_INSTRUCTION,
  FORM_MARK_SHORT_NAME,
  FORM_MARK_LONG_NAME,
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
import Images from '@assets/Images'
import IconText from 'components/IconText'
import Dash from 'react-native-dash'

import EStyleSheets from 'react-native-extended-stylesheet'
import styles from './styles'

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
const nothingWhenFormHasGeolocation = branch(formHasGeolocation, nothingAsClass)
const nothingWhenFormHasTracking = branch(formHasTracking, nothingAsClass)
const nothingWhenPristineForm = branch(propEq('pristine', true), nothingAsClass)
const nothingWhenNotSelected = branch(compose(isNil, prop('selected')), nothingAsClass)

const selectedWaypointAsWaypoint = mapProps(props => ({ ...props, waypoint: props.selectedWaypoint }))

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)

const icon = compose(
  fromClass(IconText).contramap,
  always)

const deleteIcon = icon({ source: Images.actions.delete })
const roundingLeftIcon = icon({ source: Images.courseConfig.roundingDirectionLeft })
const roundingRightIcon = icon({ source: Images.courseConfig.roundingDirectionRight })
const trackerIcon = icon({ source: Images.courseConfig.tracker, iconStyle: { width: 11, height: 11 } })
const locationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 11, height: 11 } })
const arrowUp = icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: 25 },
  iconStyle: { height: 12 } })

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
    concat(__, nothingWhenNotSelected(arrowUp)),
    touchableOpacity({
      style: [ styles.gateMarkSelectorItem, props.selected ? styles.gateMarkSelectorItemSelected : null ],
      onPress: (props: any) => props.selectGateSide(props.side) }),
    text({ style: styles.gateMarkSelectorText }),
    defaultTo(props.side))(
    props.mark.shortName))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
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

const PositionSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ style: { flexDirection: 'row' }, onPress: (props: any) => props.setSelectedPositionType(props.type) }),
    concat(props.icon),
    text({}))(
    'lalallaa'))

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
    touchableOpacity({
      onPress: () => navigateToCourseTrackerBinding({
        formSectionName: formMarkSectionNameByGateSide(props.selectedGateSide) })
    }),
    view({}),
    reduce(concat, nothing()))([
      text({}, formHasTracking(props) ? 'tracking device info' : 'No tracker bound yet. Please configure tracker binding.'),
      nothingWhenFormHasTracking(text({}, 'CONFIGURE OR CHANGE TRACKER BINDING')) ]))

const MarkPositionGeolocation = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => navigateToCourseGeolocation({
            formSectionName: formMarkSectionNameByGateSide(props.selectedGateSide) }) }),
    reduce(concat, nothing()))([
      text({}, formHasGeolocation(props) ? geolocationAsString(props) : 'No geolocation specified. Please configure geolocation.'),
      nothingWhenFormHasGeolocation(text({}, 'CONFIGURE OR CHANGE GEOLOCATION'))
    ]))

const MarkPositionPing = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    onPress: (props: object) => navigator.geolocation.getCurrentPosition(compose(
      props.input.onChange,
      //merge({ positionType: MarkPositionType.PingedLocation }),
      pick(['latitude', 'longitude']),
      prop('coords')
    ))
  }),
  reduce(concat, nothing()))([
  text({}, formHasPing(props) ? geolocationAsString(props) : 'No ping specified. Please configure ping.'),
  nothingWhenFormHasPing(text({}, 'CONFIGURE OR CHANGE PING'))]))

const MarkPosition = Component((props: object) =>
  compose(
    fold(props),
    concat(text({ style: styles.sectionTitle }, 'Locate or track')),
    reduce(concat, nothing()),
    concat(__, [
      nothingWhenNotTrackingSelected(toLocationFormField(MarkPositionTracking)),
      nothingWhenNotGeolocationSelected(toLocationFormField(MarkPositionGeolocation))]),
    map(compose(PositionSelectorItem.contramap, merge)))(
    [{ type: MarkPositionType.TrackingDevice, label: 'TRACKER', icon: trackerIcon },
     { type: MarkPositionType.Geolocation, label: 'LOCATION', icon: locationIcon }]))

const Appearance = Component((props: object) =>
  compose(
    fold(props))(
    text({ style: styles.sectionTitle }, 'Appearance')))

const DeleteButton = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.removeWaypoint() }))(
    deleteIcon))

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

const ShortAndLongName = Component((props: object) =>
  compose(
    fold(props),
    view({}),
    formSection({ name: formMarkSectionNameByGateSide(props.selectedGateSide) }),
    reduce(concat, nothing()),
    map(compose(
      reduxFormField,
      merge({ component: FormTextInput }),
      objOf('name'))))([
    FORM_MARK_SHORT_NAME,
    FORM_MARK_LONG_NAME ]))

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
  { type: PassingInstruction.Gate, icon: roundingLeftIcon },
  { type: PassingInstruction.Line, icon: roundingLeftIcon }]

const PassingInstructions = Component((props: object) =>
  compose(
    fold(props),
    formSection({ name: FORM_WAYPOINT_SECTION_NAME }),
    concat(text({ style: styles.sectionTitle }, 'Rounding direction')),
    view({ style: styles.passingInstructionContainer }),
    reduce(concat, nothing()),
    map(compose(
      reduxFormField,
      mergeLeft({
        name: FORM_PASSING_INSTRUCTION,
        component: PassingInstructionItem.contramap(merge(props)).fold
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
      nothingWhenEmptyWaypoint(PassingInstructions),
      nothingWhenNotAGate(GateMarkSelector),
      //nothingWhenEmptyWaypoint(ShortAndLongName)
    ])),
    when(always(isGateWaypoint(props)), view({ style: styles.gateEditContainer })),
    reduce(concat, nothing()))([
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
    scrollView({ horizontal: true }),
    reduce(concat, nothing()),
    mapIndexed(waypointItemToComponent))(
    props.course.waypoints))
