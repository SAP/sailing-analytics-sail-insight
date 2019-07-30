import { __, compose, always, both, has,
  prop, map, reduce, concat, merge,
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

const hasDefinedProp = (p: string) => both(compose(not, isNil, prop(p)), has(p))

const mapStateToProps = (state: any, props: any) => {
  return {
    selectedWaypoint: getSelectedWaypoint(state)
  }
}

const isGateWaypoint = compose(both(hasDefinedProp('leftMark'), hasDefinedProp('rightMark')), prop('item'))
const isMarkWaypoint = compose(both(hasDefinedProp('leftMark'), compose(not, hasDefinedProp('rightMark'))), prop('item'))
const isStartOrFinishGate = both(isGateWaypoint, compose(either(equals('Start'), equals('Finish')), prop('longName'), prop('item')))
const isWaypointSelected = (props: any) => props.selectedWaypoint.id === props.item.id

const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenIsNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)

const gateIcon = fromClass(IconText).contramap(always({
  source: Images.actions.minus
}))

const plusIcon = fromClass(IconText).contramap(always({
  style: { width: 100, height: 100 },
  source: Images.actions.add
}))

const GateWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({ style: [styles.waypointContainer, isWaypointSelected(props) && styles.selectedWaypointContainer] }),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, props.item.longName)
  ]))

const MarkWaypoint = Component((props: any) =>
  compose(
    fold(props),
    view({}),
    reduce(concat, nothing()))([
    gateIcon,
    text({}, props.item.longName || 'Choose')
  ]))

const SameStartFinish = Component((props: any) =>
compose(
  fold(props),
  reduce(concat, nothing()))([
  text({}, 'Start/Finish are the same')
]))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      SameStartFinish
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    view({}))(
    plusIcon))

const waypointItemToComponent = item => compose(
  touchableOpacity({ onPress: props => props.selectWaypoint(item.id) }),
  cond([[
    isGateWaypoint, compose(GateWaypoint.contramap, merge)],[
    isMarkWaypoint, compose(MarkWaypoint.contramap, merge)]]),
  objOf('item'))(
  item)

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
