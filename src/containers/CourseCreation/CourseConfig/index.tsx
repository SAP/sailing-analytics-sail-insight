import { __, compose, always, both, path, when, append, zipWith,
  prop, map, reduce, concat, merge, props as rProps, defaultTo,
  objOf, insert, isNil, not, either, equals, cond, tap,
  propEq } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity } from 'components/fp/react-native'

import { Switch } from 'react-native'

import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'

import {
  courseConfigCommonFormSettings,
  FORM_ROUNDING_DIRECTION,
  initialValues
} from 'forms/courseConfig'
import { ControlPointClass, GateSide, MarkPositionType } from 'models/Course'

import { selectWaypoint, removeWaypoint, selectGateSide, addWaypoint, assignControlPointClass, assignControlPoint } from 'actions/courses'
import { getSelectedWaypoint, getSelectedMark, getSelectedGateSide, getMarkInventory } from 'selectors/course'

import { navigateToCourseGeolocation } from 'navigation'

import Images from '@assets/Images'
import IconText from 'components/IconText'

import styles from './styles'

const controlPointClassToLabel = {
  [ControlPointClass.MarkPair]: 'Gate/Line',
  [ControlPointClass.Mark]: 'Mark'
}

const mapStateToProps = (state: any, props: any) => ({
    initialValues,
    selectedWaypoint: getSelectedWaypoint(state),
    selectedMark: getSelectedMark(state),
    selectedGateSide: getSelectedGateSide(state),
    inventory: getMarkInventory(state)
  })

const waypointClass = path(['waypoint', 'controlPoint', 'class'])
const isGateWaypoint = compose(equals(ControlPointClass.MarkPair), waypointClass)
const isMarkWaypoint = compose(equals(ControlPointClass.Mark), waypointClass)
const isEmptyWaypoint = compose(isNil, path(['waypoint', 'controlPoint']))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('waypoint')))
const isWaypointSelected = (props: any) => props.selectedWaypoint && props.selectedWaypoint.id === props.waypoint.id
const hasGeolocation = compose(propEq('positionType', MarkPositionType.Geolocation), defaultTo({}), path(['selectedMark', 'position']))
const hasTracking = compose(propEq('positionType', MarkPositionType.TrackingDevice), defaultTo({}), path(['selectedMark', 'position']))
const hasPing = compose(propEq('positionType', MarkPositionType.PingedLocation), defaultTo({}), path(['selectedMark', 'position']))

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenGate = branch(isGateWaypoint, nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingIfEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingIfNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)
const nothingWhenNotPingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.PingedLocation)), nothingAsClass)
const nothingWhenHasGeolocation = branch(hasGeolocation, nothingAsClass)
const nothingWhenHasTracking = branch(hasTracking, nothingAsClass)
const nothingWhenHasPing = branch(hasPing, nothingAsClass)

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)

const icon = ({ source, style }) => fromClass(IconText).contramap(always({ source, style }))
const gateIcon = icon({ source: Images.actions.minus })
const deleteIcon = icon({ source: Images.actions.delete })

const plusIcon = icon({
  source: Images.actions.add,
  style: { width: 100, height: 100 }
})

const GateWaypoint = Component((props: object) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    concat(gateIcon),
    text({}),
    defaultTo(''),
    path(['waypoint', 'longName']))(
    props))

const GateMarkSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.selectGateSide(props.side) }),
    text({}),
    defaultTo(props.mark.side))(
    props.mark.longName))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()),
    map(compose(GateMarkSelectorItem.contramap, merge, objOf('mark'))),
    map(when(compose(equals(props.selectedGateSide), prop('side')), merge({ selected: true }))),
    zipWith(merge, [{ side: GateSide.LEFT }, { side: GateSide.RIGHT }]),
    rProps(['leftMark', 'rightMark']),
    path(['selectedWaypoint', 'controlPoint']))(
    props))

const MarkWaypoint = Component((props: object) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, defaultTo('Choose', props.waypoint.longName))
  ]))

const SameStartFinish = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, 'Start/Finish are the same'),
    fromClass(Switch)
  ]))

const MarkPositionItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.setSelectedPositionType(props.type) }),
    text({}))(
    props.type))

const MarkPositionTracking = Component((props: object) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()))([
      text({}, hasTracking(props) ? 'tracking device info' : 'No tracker bound yet. Please configure tracker binding.'),
      nothingWhenHasTracking(text({}, 'CONFIGURE OR CHANGE TRACKER BINDING')) ]))

const MarkPositionGeolocation = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: navigateToCourseGeolocation }),
    reduce(concat, nothing()))([
      text({}, hasGeolocation(props) ? 'geolocation info' : 'No geolocation specified. Please configure geolocation.'),
      nothingWhenHasGeolocation(text({}, 'CONFIGURE OR CHANGE GEOLOCATION'))
    ]))

const MarkPositionPing = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, hasPing(props) ? 'ping info' : 'No ping specified. Please configure ping.'),
    nothingWhenHasPing(text({}, 'CONFIGURE OR CHANGE PING'))]))

const MarkPosition = Component((props: object) =>
  compose(
    fold(props),
    withSelectedPositionType,
    concat(text({}, 'LOCATE OR TRACK')),
    concat(__, nothingWhenNotTrackingSelected(MarkPositionTracking)),
    concat(__, nothingWhenNotGeolocationSelected(MarkPositionGeolocation)),
    concat(__, nothingWhenNotPingSelected(MarkPositionPing)),
    reduce(concat, nothing()),
    map(compose(
      MarkPositionItem.contramap,
      merge,
      objOf('type')
    )))(
    [MarkPositionType.TrackingDevice, MarkPositionType.Geolocation, MarkPositionType.PingedLocation]))

const Appearance = Component((props: object) =>
  compose(
    fold(props))(
    text({}, 'APPEARANCE')))

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

const ShortAndLongName = Component(props =>
  compose(
    fold(props)
  ))

const RoundingDirectionItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.input.onChange(props.type) }),
    text({}))(
    props.type))

const RoundingDirection = Component((props: object) =>
  compose(
    fold(props),
    concat(text({}, 'ROUNDING DIRECTION')),
    reduce(concat, nothing()),
    map(compose(
      reduxFormField,
      merge({
        name: FORM_ROUNDING_DIRECTION,
        component: RoundingDirectionItem.fold
      }),
      objOf('type'))))(
    ['left', 'right']))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(merge(props, { waypoint: props.selectedWaypoint })),
    reduce(concat, nothing()))([
      nothingWhenStartOrFinishGate(DeleteButton),
      nothingWhenNotStartOrFinishGate(SameStartFinish),
      nothingWhenNotAGate(GateMarkSelector),
      nothingIfEmptyWaypoint(MarkPosition),
      nothingIfEmptyWaypoint(Appearance),
      nothingIfNotEmptyWaypoint(CreateNewSelector),
      compose(nothingWhenGate, nothingIfEmptyWaypoint)(RoundingDirection)
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.addWaypoint(1) }))(
    plusIcon))

const waypointItemToComponent = (waypoint: any) => compose(
  touchableOpacity({ onPress: (props: any) => props.selectWaypoint(waypoint.id) }),
  cond([[
    isGateWaypoint, compose(GateWaypoint.contramap, merge)],[
    isMarkWaypoint, compose(MarkWaypoint.contramap, merge)],[
    isEmptyWaypoint, compose(MarkWaypoint.contramap, merge) ]]),
  objOf('waypoint'))(
  waypoint)

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, {
      selectWaypoint, removeWaypoint, selectGateSide,
      addWaypoint, assignControlPointClass, assignControlPoint
    }),
    reduxForm(courseConfigCommonFormSettings),
    concat(__, nothingWhenNoSelectedWaypoint(WaypointEditForm)),
    view({}),
    scrollView({ horizontal: true, style: { height: 100 } }),
    reduce(concat, nothing()),
    items => insert(items.length - 1, AddButton, items),
    map(waypointItemToComponent))(
    props.course.waypoints))
