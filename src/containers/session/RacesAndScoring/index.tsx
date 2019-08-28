import { __, compose, concat, equals, length, objOf, prepend, split,
  merge, not, path, reduce, range, map, always, when, tap, toString } from 'ramda'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
} from 'components/fp/component'
import { forwardingPropsFlatList, text, touchableOpacity, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DISCARDS,
  FORM_KEY_NUMBER_OF_RACES,
} from 'forms/eventCreation'

import { Picker } from 'react-native'

import styles from './styles'

const areDiscardsEmpty = compose(equals(0), length, path(['input', 'value']))
const nothingWhenDiscardsEmpty = branch(areDiscardsEmpty, nothingAsClass)
const nothingWhenDiscardsNotEmpty = branch(compose(not, areDiscardsEmpty), nothingAsClass)

const FramedNumberItem = Component(props => compose(
  fold(props),
  view({ style: styles.framedNumberItem }),
  text({ style: styles.framedNumberItemText }))(
  props.value))

const FramedNumber = Component(props => compose(
  fold(props),
  view({ style: styles.framedNumber }),
  reduce(concat, nothing()),
  map(compose(FramedNumberItem.contramap, always, objOf('value'))),
  when(compose(equals(1), length), prepend('0')),
  split(''),
  toString)(
  props.value))

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, 'Planned Number of Races')),
    view({ style: styles.raceNumberContainer }),
    concat(FramedNumber.contramap(always({ value: props.input.value }))))(
    fromClass(Picker).contramap(merge({
      style: { position: 'absolute', top: 0, width: 1000, height: 1000 },
      selectedValue: Number(props.input.value),
      onValueChange: props.input.onChange,
      children: compose(
        map(fromClass(Picker.Item).fold),
        map(v => ({ value: v, label: v.toString() })))(
        range(1, 51))
    }))))

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

const discardSelectorItem = Component((props: any) => compose(
  fold(props),
  touchableOpacity({
    style: [
      styles.discardSelectorItemContainer,
      ...(props.item.value === '+' ? [styles.discardSelectorPlusContainer] : []),
    ],
    onPress: () => props.item.value !== '+'
    ? props.updateDiscards(props.item.index, Math.floor(Math.random() * 10))
    : props.addDiscard(),
  }),
  text({
    style: [
      styles.discardSelectorItemText,
      ...(props.item.value === '+' ? [styles.discardSelectorPlusText] : []),
    ]
  }))(
  props.item.value || ''))

const discardInput = Component((props: any) => compose(
  fold(props),
  view({ style: styles.discardContainer }),
  concat(text({ style: styles.textHeader }, 'Discard after race numbers')),
  contramap(merge({
    data: [
      ...props.input.value.map((value, index) => ({ value, index })),
      { value: '+', index: props.input.value.length },
    ],
    updateDiscards: (index, value) => props.input.onChange(props.input.value.map(
      (it: any, ind: number) => ind === index ? value : it
    )),
    addDiscard: () => props.input.onChange([
      ...props.input.value,
      undefined,
    ]),
    renderItem: discardSelectorItem.fold,
    showsHorizontalScrollIndicator: false,
    horizontal: true,
  })),
)(forwardingPropsFlatList))

const setDiscardButton = Component((props: any) => compose(
  fold(props),
  touchableOpacity({
    onPress: () => props.input.onChange([undefined]),
    style: styles.setDiscardButton,
    })
)(text({ style: styles.setDiscardText }, 'SET DISCARD')))

const discardInputBranching = Component((props: any) => compose(
  fold(props),
  reduce(concat, nothing()))([
    nothingWhenDiscardsNotEmpty(setDiscardButton),
    nothingWhenDiscardsEmpty(discardInput),
  ]))

const discardInputFormField = reduxFormField({
  name: FORM_KEY_DISCARDS,
  component: discardInputBranching.fold,
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
