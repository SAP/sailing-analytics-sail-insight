import { __, compose, always,
    prop, map, reduce, concat, merge } from 'ramda'

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
import { ControlPointClass, GateSide, MarkPositionType, PassingInstruction } from 'models/Course'

import styles from './styles'
import IconText from 'components/IconText'
import Images from '@assets/Images'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markIcon = icon({ source: Images.courseConfig.markIcon, iconStyle: { width: 80, height: 80 } })

const ControlPointClassSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.assignControlPointClass(props.class) }))(
    props.icon))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.createNewClassContainer }),
    reduce(concat, nothing()),
    map(compose(ControlPointClassSelectorItem.contramap, merge)))([
    { ['class']: ControlPointClass.MarkPair, icon: gateIcon },
    { ['class']: ControlPointClass.Mark, icon: markIcon }]))

export default Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.mainContainer }),
    concat(text({ style: styles.title }, 'MARK INVENTORY')),
    concat(CreateNewSelector))(
    nothing()))