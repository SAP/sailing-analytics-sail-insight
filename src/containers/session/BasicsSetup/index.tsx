import { __, compose, concat, mergeLeft, reduce, always, merge, defaultTo } from 'ramda'
import { TextInput } from 'react-native'

import I18n from 'i18n'

import { Component, contramap, fold, fromClass, nothing } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField, textInputWithMeta } from 'components/fp/redux-form'
import IconText from 'components/IconText'
import {
  FORM_KEY_DATE_FROM,
  FORM_KEY_DATE_TO,
  FORM_KEY_LOCATION,
  FORM_KEY_NAME,
} from 'forms/eventCreation'

import DatePicker from 'react-native-datepicker'

import Images from '@assets/Images'
import styles, { darkerGray, lighterGray } from './styles'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const locationIcon = icon({
  source: Images.courseConfig.location,
  iconStyle: { width: 11, height: 11, tintColor: 'black' },
  style: { position: 'absolute', bottom: 15, right: 5 }
})

const fieldBox = (child: any) => Component((props: any) => compose(
  fold(props),
  view({ style: styles.fieldBoxContainer }),
  concat(text({ style: styles.fieldBoxLabel }, props.label)),
  view({style: { flexDirection: 'row' }}),
  reduce(concat, nothing()))([
    child,
    defaultTo(nothing(), props.icon)
  ]))

const boxedTextInput = fieldBox(
  textInputWithMeta.contramap((props: any) => ({
    ...props,
    value: props.input.value,
    onChangeText: props.input.onChange,
    underlineColorAndroid: darkerGray,
    style: styles.textInput
  })))

const nameInput = reduxFormField({
  label: I18n.t('text_placeholder_session_name'),
  name: FORM_KEY_NAME,
  component: boxedTextInput.fold,
})

const locationInput = reduxFormField({
  label: I18n.t('text_location'),
  name: FORM_KEY_LOCATION,
  component: boxedTextInput.contramap(merge({ icon: locationIcon })).fold,
})

const formDatePicker = Component((props: any) => compose(
  fold(props),
  view({ style: styles.formDatePickerContainer }),
  concat(icon({ source: props.icon, style: { tintColor: lighterGray }})),
  contramap((props: any) => ({
    onDateChange: props.input.onChange,
    date: props.input.value,
    androidMode: 'spinner',
    mode: 'date',
    showIcon: false,
    format: 'MM/DD/YYYY',
    customStyles: {
      dateInput: {
        height: 'auto',
        alignItems: 'flex-start',
        borderWidth: 0,
      }
    },
  })))(
  fromClass(DatePicker)))

const startDateInput = reduxFormField({
  name: FORM_KEY_DATE_FROM,
  component: formDatePicker.fold,
  icon: Images.actions.arrowRight,
})

const endDateInput = reduxFormField({
  name: FORM_KEY_DATE_TO,
  component: formDatePicker.fold,
  icon: Images.actions.arrowLeft,
})

const dateInput = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({ label: 'Date' })),
  fieldBox,
  view({ style: styles.dateInputContainer }),
  reduce(concat, nothing()))(
  [startDateInput, endDateInput]))

export default Component((props: Object) => compose(
  fold(props),
  concat(__, view({ style: styles.containerAngledBorder }, nothing())),
  view({ style: styles.container }),
  reduce(concat, nothing()))([
    text({ style: styles.sectionHeaderStyle }, 'BASICS'),
    nameInput,
    dateInput,
    locationInput,
  ]))
