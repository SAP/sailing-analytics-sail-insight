import {
  __, compose, concat, equals, length, objOf,
  addIndex, append, merge, not, path, reduce,
  map, always, prop, update, propEq, reject } from 'ramda'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  recomposeMapProps as mapProps,
  recomposeWithHandlers as withHandlers
} from 'components/fp/component'
import { forwardingPropsFlatList, text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DISCARDS,
  FORM_KEY_NUMBER_OF_RACES,
} from 'forms/eventCreation'

import Images from '@assets/Images'
import IconText from 'components/IconText'
import { overlayPicker, FramedNumber } from '../common'

import styles from './styles'

const mapIndexed = addIndex(map)

const areDiscardsEmpty = compose(equals(0), length, path(['input', 'value']))
const nothingWhenDiscardsEmpty = branch(areDiscardsEmpty, nothingAsClass)
const nothingWhenDiscardsNotEmpty = branch(compose(not, areDiscardsEmpty), nothingAsClass)

const plusIcon = fromClass(IconText).contramap(always({
  source: Images.actions.plus,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center' },
  iconStyle: { width: 25, height: 25 }
}))

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, 'Planned Number of Races')),
    view({ style: styles.raceNumberContainer }),
    overlayPicker({
      style: { position: 'absolute', top: 0, width: 160, height: 80, color: 'white' },
      selectedValue: Number(props.input.value),
      onValueChange: props.input.onChange,
    }))(
    FramedNumber.contramap(always({ value: props.input.value }))))

const raceNumberFormField = reduxFormField({
  name: FORM_KEY_NUMBER_OF_RACES,
  component: raceNumberSelector.fold,
})

const scoringSystemLabel = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({ style: styles.textHeader }, 'Low Point scoring applies.'),
      text({ style: styles.textDescription }, 'Please contact us if you require any other scoring system.'),
    ]))

const DiscardSelectorItem = Component((props: any) => compose(
  fold(props),
  overlayPicker({
    onValueChange: (value: number) => props.updateDiscardItem(props.item.index, value),
    style: { position: 'absolute', top: 0, left: 0, width: 60, height: 60 }
  }),
  view({ style: styles.discardSelectorItemContainer }),
  text({ style: styles.discardSelectorItemText }))(
  props.item.value))

const AddDiscardButton = Component((props: any) => compose(
  fold(props),
  overlayPicker({
    onValueChange: (value: number) => props.addDiscard(value),
    style: { position: 'absolute', top: 0, left: 0, width: 60, height: 60 }
  }),
  view({ style: styles.discardSelectorPlusContainer }))(
  plusIcon))

const DiscardSelector = Component((props: any) => compose(
  fold(props),
  concat(text({ style: styles.textHeader }, 'Discard after race numbers')),
  view({ style: styles.discardContainer }),
  contramap(merge({
    style: { flexGrow: 0 },
    renderItem: (props: any) =>
      props.item.type === 'add' ?
        AddDiscardButton.fold(props) :
        DiscardSelectorItem.fold(props),
    showsHorizontalScrollIndicator: false,
    horizontal: true,
  })))(forwardingPropsFlatList))

// const setDiscardButton = Component((props: any) => compose(
//   fold(props),
//   touchableOpacity({
//     onPress: () => props.input.onChange([undefined]),
//     style: styles.setDiscardButton,
//     })
// )(text({ style: styles.setDiscardText }, 'SET DISCARD')))

// const discardInputBranching = Component((props: any) => compose(
//   fold(props),
//   reduce(concat, nothing()))([
//     nothingWhenDiscardsNotEmpty(setDiscardButton),
//     nothingWhenDiscardsEmpty(discardInput),
//   ]))

const withUpdatingDiscardItem = withHandlers({
  updateDiscardItem: (props: any) => (index: number, value: object) => compose(
    props.input.onChange,
    map(prop('value')),
    reject(propEq('type', 'add')),
    update(index, { index, value }),
    prop('data'))(
    props)
})

const withAddDiscard = withHandlers({
  addDiscard: (props: any) => (value: number) => compose(
    props.input.onChange,
    append(value),
    map(prop('value')),
    reject(propEq('type', 'add')),
    prop('data'))(
    props)
})

const withDiscardDataFromForm = mapProps(props => compose(
  merge(props),
  objOf('data'),
  append({ type: 'add' }),
  mapIndexed((value, index) => ({ value, index })),
  path(['input', 'value']))(props))

const discardInputFormField = reduxFormField({
  name: FORM_KEY_DISCARDS,
  component: compose(
    withDiscardDataFromForm,
    withUpdatingDiscardItem,
    withAddDiscard)(
    DiscardSelector).fold
})

export default Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
      text({ style: styles.sectionHeaderStyle }, 'RACES & SCORING'),
      raceNumberFormField,
      discardInputFormField,
      scoringSystemLabel,
    ]))
