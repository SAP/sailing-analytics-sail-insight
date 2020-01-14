import {
  __, addIndex, always, append, compose, concat,
  map, merge, objOf,
  path, reduce } from 'ramda'

import {
  Component,
  fold,
  nothing,
  recomposeMapProps as mapProps } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DISCARDS,
  FORM_KEY_NUMBER_OF_RACES } from 'forms/eventCreation'
import I18n from 'i18n'

import { DiscardSelector, FramedNumber, overlayPicker, withAddDiscard, withUpdatingDiscardItem } from '../common'

import styles from './styles'

const mapIndexed = addIndex(map)

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, I18n.t('text_planned_number_of_races'))),
    view({ style: styles.raceNumberContainer }),
    overlayPicker({
      style: { },
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
      text({ style: styles.textHeader }, I18n.t('text_low_point_scoring')),
      text({ style: styles.textDescription }, I18n.t('text_contact_for_other_scoring')),
    ]))

const withDiscardDataFromForm = mapProps(props => compose(
  merge(props),
  objOf('data'),
  append({ type: 'add' }),
  mapIndexed((value, index) => ({ value, index })),
  path(['input', 'value']))(props))

const discardInputFormField = Component(props => compose(
  fold(props))(
  reduxFormField({
    name: FORM_KEY_DISCARDS,
    props,
    component: props => compose(
      withDiscardDataFromForm,
      withUpdatingDiscardItem(props.input.onChange),
      withAddDiscard(props.input.onChange))(
      DiscardSelector).fold(props)
  })))

export default Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
      text({ style: styles.sectionHeaderStyle }, I18n.t('caption_races_and_scoring')),
      raceNumberFormField,
      discardInputFormField,
      scoringSystemLabel,
    ]))
