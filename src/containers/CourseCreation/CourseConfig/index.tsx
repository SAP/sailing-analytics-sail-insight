import { __, compose, always, both, path, when,
  prop, map, reduce, concat, merge, props as rProps, defaultTo,
  objOf, insert, isNil, not, either, equals, cond } from 'ramda'

import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  reduxConnect as connect,
  recomposeWithState as withState,
  recomposeBranch as branch
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity } from 'components/fp/react-native'

import { Switch } from 'react-native'

import { ControlPointClass } from 'models/Course'

import { selectWaypoint, removeWaypoint, selectMark, addWaypoint } from 'actions/courses'
import { getSelectedWaypoint, getSelectedMark } from 'selectors/course'

import Images from '@assets/Images'
import IconText from 'components/IconText'

import styles from './styles'

const mapStateToProps = (state: any, props: any) => {
  return {
    selectedWaypoint: getSelectedWaypoint(state),
    selectedMark: getSelectedMark(state)
  }
}

const waypointClass = path(['waypoint', 'controlPoint', 'class'])
const isGateWaypoint = compose(equals(ControlPointClass.MarkPair), waypointClass)
const isMarkWaypoint = compose(equals(ControlPointClass.Mark), waypointClass)
const isEmptyWaypoint = compose(isNil, path(['waypoint', 'controlPoint']))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('waypoint')))
const isWaypointSelected = (props: any) => props.selectedWaypoint && props.selectedWaypoint.id === props.waypoint.id

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)

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
    touchableOpacity({ onPress: (props: any) => props.selectMark(props.mark.id) }),
    text({}),
    defaultTo(''),
    path(['mark', 'longName']))(
    props))

const GateMarkSelector = Component((props: any) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()),
    map(compose(
      GateMarkSelectorItem.contramap,
      merge,
      when(compose(equals(props.selectedMark.id), path(['mark', 'id'])), merge({ selected: true })),
      objOf('mark'))),
    rProps(['leftMark', 'rightMark']),
    path(['selectedWaypoint', 'controlPoint']))(
    props))

const MarkWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({}),
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

const MarkPosition = Component(props =>
  compose(
    fold(props),
    reduce(concat, nothing()),
    map(text({})))(
    ['Tracker', 'PING', 'GEO']))

const Appearance = Component(props =>
  compose(
    fold(props))(
    text({}, 'Appearance')))

const DeleteButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.removeWaypoint() }))(
    deleteIcon))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(merge(props, { waypoint: props.selectedWaypoint })),
    reduce(concat, nothing()))([
      nothingWhenStartOrFinishGate(DeleteButton),
      nothingWhenNotStartOrFinishGate(SameStartFinish),
      nothingWhenNotAGate(GateMarkSelector),
      MarkPosition,
      Appearance
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
    connect(mapStateToProps, { selectWaypoint, removeWaypoint, selectMark, addWaypoint }),
    concat(__, nothingWhenNoSelectedWaypoint(WaypointEditForm)),
    view({}),
    scrollView({ horizontal: true, style: { height: 100 } }),
    reduce(concat, nothing()),
    items => insert(items.length - 1, AddButton, items),
    map(waypointItemToComponent))(
    props.course.waypoints))
