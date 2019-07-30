import { __, compose, always, both, has,
  prop, map, reduce, concat, merge, curry,
  objOf, insert, isNil, not, either, equals, cond, tap } from 'ramda'

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

import { selectWaypoint } from 'actions/races'
import { getSelectedWaypoint } from 'selectors/race'

import Images from '@assets/Images'
import IconText from 'components/IconText'

import styles from './styles'

const hasDefinedProp = curry((p: string, v: any) => both(has(p), compose(not, isNil, prop(p)), v))

const mapStateToProps = (state: any, props: any) => {
  return {
    selectedWaypoint: getSelectedWaypoint(state)
  }
}

const isGateWaypoint = compose(both(hasDefinedProp('leftMark'), hasDefinedProp('rightMark')), prop('waypoint'))
const isMarkWaypoint = compose(both(hasDefinedProp('leftMark'), compose(not, hasDefinedProp('rightMark'))), prop('waypoint'))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('waypoint')))
const isWaypointSelected = (props: any) => props.selectedWaypoint && props.selectedWaypoint.id === props.waypoint.id

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenIsNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)

const icon = ({ source, style }) => fromClass(IconText).contramap(always({ source, style }))
const gateIcon = icon({ source: Images.actions.minus })

const plusIcon = icon({
  source: Images.actions.add,
  style: { width: 100, height: 100 }
})

const deleteIcon = icon({ source: null })

const GateWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, props.waypoint.longName)
  ]))

const MarkWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, props.waypoint.longName || 'Choose')
  ]))

const SameStartFinish = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, 'Start/Finish are the same')
  ]))

const DeleteButton = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
    text({}, 'Start/Finish are the same')
  ]))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(merge(props, { waypoint: props.selectedWaypoint })),
    reduce(concat, nothing()))([
      nothingWhenIsNotStartOrFinishGate(SameStartFinish)
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    view({}))(
    plusIcon))

const waypointItemToComponent = (waypoint: any) => compose(
  touchableOpacity({ onPress: (props: any) => props.selectWaypoint(waypoint.id) }),
  cond([[
    isGateWaypoint, compose(GateWaypoint.contramap, merge)],[
    isMarkWaypoint, compose(MarkWaypoint.contramap, merge)]]),
  objOf('waypoint'))(
  waypoint)

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { selectWaypoint }),
    concat(__, nothingWhenNoSelectedWaypoint(WaypointEditForm)),
    view({}),
    scrollView({ horizontal: true, style: { height: 100 } }),
    reduce(concat, nothing()),
    items => insert(items.length - 1, AddButton, items),
    map(waypointItemToComponent))(
    props.course.waypoints))
