import { __, compose, concat, equals, length, merge, not, path, reduce } from 'ramda'

import Slider from '@react-native-community/slider'

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

import styles from './styles'

const areDiscardsEmpty = compose(equals(0), length, path(['input', 'value']))
const nothingWhenDiscardsEmpty = branch(areDiscardsEmpty, nothingAsClass)
const nothingWhenDiscardsNotEmpty = branch(compose(not, areDiscardsEmpty), nothingAsClass)

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({ style: styles.textHeader }, 'Planned Number of Races'),
      fromClass(Slider).contramap(merge({
        value: Number(props.input.value),
        onValueChange: props.input.onChange,
      })),
      text({}, `${props.input.value}`)]))

const raceNumberFormField = reduxFormField({
  name: FORM_KEY_NUMBER_OF_RACES,
  component: raceNumberSelector.fold,
  ...sliderSettings,
})

const scoringSystemLabel = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({ style: styles.textHeader }, 'Low Point scoring applies'),
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
  })
)(props.item.value || ''))

const discardInput = Component((props: any) => compose(
  fold(props),
  view({}),
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
