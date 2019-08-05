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

import { ControlPointClass, GateSide, MarkPositionType } from 'models/Course'
import { FORM_ROUNDING_DIRECTION, courseConfigCommonFormSettings } from 'forms/courseConfig'

import { selectWaypoint, removeWaypoint, selectGateSide, addWaypoint, assignControlPointClass } from 'actions/courses'
import { getSelectedWaypoint, getSelectedMark, getSelectedGateSide } from 'selectors/course'

import Images from '@assets/Images'
import IconText from 'components/IconText'

import styles from './styles'

const controlPointClassToLabel = {
  [ControlPointClass.MarkPair]: 'Gate/Line',
  [ControlPointClass.Mark]: 'Mark'
}

const mapStateToProps = (state: any, props: any) => ({
    selectedWaypoint: getSelectedWaypoint(state),
    selectedMark: getSelectedMark(state),
    selectedGateSide: getSelectedGateSide(state),
    controlPoints: [{}, {}, {}]
  })

const waypointClass = path(['waypoint', 'controlPoint', 'class'])
const isGateWaypoint = compose(equals(ControlPointClass.MarkPair), waypointClass)
const isMarkWaypoint = compose(equals(ControlPointClass.Mark), waypointClass)
const isEmptyWaypoint = compose(isNil, path(['waypoint', 'controlPoint']))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('waypoint')))
const isWaypointSelected = (props: any) => props.selectedWaypoint && props.selectedWaypoint.id === props.waypoint.id

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenGate = branch(isGateWaypoint, nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingIfEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingIfNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)

const icon = ({ source, style }) => fromClass(IconText).contramap(always({ source, style }))
const gateIcon = icon({ source: Images.actions.minus })
const deleteIcon = icon({ source: Images.actions.delete })

const plusIcon = icon({
  source: Images.actions.add,
  style: { width: 100, height: 100 }
})

const GateWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    concat(gateIcon),
    text({}),
    defaultTo(''),
    path(['waypoint', 'longName']))(
    props))

const GateMarkSelectorItem = Component((props) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.selectGateSide(props.side) }),
    text({}),
    defaultTo(props.mark.side))(
    props.mark.longName))

const GateMarkSelector = Component((props: any) =>
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

const MarkWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, defaultTo('Choose', props.waypoint.longName))
  ]))

const SameStartFinish = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, 'Start/Finish are the same'),
    fromClass(Switch)
  ]))

const MarkPositionItem = Component(props =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.setSelectedPositionType(props.type) }),
    text({}))(
    props.type))

const MarkPositionTracking = Component(props =>
  compose(
    fold(props),
    tap(() => console.log(props)))(
    text({}, 'tracking device info')))

const MarkPositionGeolocation = Component(props =>
  compose(
    fold(props))(
    text({}, 'geolocation info')))

const MarkPosition = Component(props =>
  compose(
    fold(props),
    withSelectedPositionType,
    concat(text({}, 'LOCATE OR TRACK')),
    concat(__, nothingWhenNotTrackingSelected(MarkPositionTracking)),
    concat(__, nothingWhenNotGeolocationSelected(MarkPositionGeolocation)),
    reduce(concat, nothing()),
    map(compose(
      MarkPositionItem.contramap,
      merge,
      objOf('type')
    )))(
    [MarkPositionType.TrackingDevice, MarkPositionType.Geolocation]))

const Appearance = Component(props =>
  compose(
    fold(props))(
    text({}, 'APPEARANCE')))

const DeleteButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.removeWaypoint() }))(
    deleteIcon))

const ControlPointClassSelectorItem = Component(props =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPointClass(props.class) }),
    text({}),
    prop(__, controlPointClassToLabel))(
    props.class))

const ControlPointSelectorItem = Component(props =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPoint(props.item) }),
    text({}))(
    'this is a control point item'))

const ControlPointList = Component(props =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()),
    map(compose(ControlPointSelectorItem.contramap, merge, objOf('item'))))(
    props.controlPoints))

const ControlPointSelector = Component(props =>
  compose(
    fold(props),
    view({}),
    concat(text({}, 'CREATE NEW')),
    reduce(concat, nothing()),
    append(ControlPointList),
    map(compose(ControlPointClassSelectorItem.contramap, merge, objOf('class'))))([
    ControlPointClass.MarkPair,
    ControlPointClass.Mark ]))

const RoundingDirectionItem = Component(props =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.input.onChange(props.type) }),
    text({}))(
    props.type))

const RoundingDirection = Component(props =>
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
      nothingIfNotEmptyWaypoint(ControlPointSelector),
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
    connect(mapStateToProps, { selectWaypoint, removeWaypoint, selectGateSide, addWaypoint, assignControlPointClass }),
    reduxForm(courseConfigCommonFormSettings),
    concat(__, nothingWhenNoSelectedWaypoint(WaypointEditForm)),
    view({}),
    scrollView({ horizontal: true, style: { height: 100 } }),
    reduce(concat, nothing()),
    items => insert(items.length - 1, AddButton, items),
    map(waypointItemToComponent))(
    props.course.waypoints))
