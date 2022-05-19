import { __, always, compose, concat, defaultTo, merge, mergeLeft, reduce } from 'ramda'
import React from 'react'
import I18n from 'i18n'
import moment from 'moment'
import { Platform, View } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Component, contramap, fold, fromClass, nothing, recomposeWithState as withState } from 'components/fp/component'
import { text, view, touchableOpacity } from 'components/fp/react-native'
import { field as reduxFormField, textInputWithMeta } from 'components/fp/redux-form'
import IconText from 'components/IconText'
import {
  FORM_KEY_DATE_FROM,
  FORM_KEY_DATE_TO,
  FORM_KEY_LOCATION,
  FORM_KEY_NAME,
} from 'forms/eventCreation'

import { fieldValueOrInitialIfEmpty } from '../common'

import Images from '@assets/Images'
import styles, { darkerGray, lighterGray } from './styles'
import { $primaryButtonColor } from 'styles/colors'

const icon = compose(
  fromClass(IconText).contramap,
  always)

// TODO: Revisit this once React gets an update from 16.13
// const fieldBox = (child: any) => Component((props: any) => compose(
//   fold(props),
//   view({ style: styles.fieldBoxContainer }),
//   concat(text({ style: styles.fieldBoxLabel }, props.label)),
//   view({style: { flexDirection: 'row' }}),
//   reduce(concat, nothing()))([
//     child,
//     defaultTo(nothing(), props.icon)
//   ]))

const fieldBox = (child: any) => Component((props: any) =>
  <View style={styles.fieldBoxContainer}>
    {text({ style: styles.fieldBoxLabel }, props.label).fold(props)}
    <View style={{ flexDirection: 'row' }}>
      {child.fold(props)}
      {defaultTo(nothing(), props.icon).fold(props)}
    </View>
  </View>)

const boxedTextInput = fieldBox(
  textInputWithMeta.contramap((props: any) => ({
    ...props,
    defaultValue: props.input.value,
    onChangeText: props.input.onChange,
    // underlineColorAndroid: darkerGray,
    borderBottomWidth: 1,
    borderBottomColor: darkerGray,
    style: styles.textInput
  })))

const nameInput = Component((props: any) => compose(
  fold(props))(
  reduxFormField({
    label: I18n.t('text_placeholder_session_name'),
    placeholder: props.defaultValues && props.defaultValues[FORM_KEY_NAME],
    name: FORM_KEY_NAME,
    component: boxedTextInput.fold,
})))

const locationInput = reduxFormField({
  label: I18n.t('text_location'),
  name: FORM_KEY_LOCATION,
  component: boxedTextInput.fold,
})

const toDate = (value: any) => {
  return moment(value).format('MM/DD/YYYY')
}

const datePickerTouchableView = Component((props: any) =>  compose(
  fold(props),
  touchableOpacity({
    onPress: () => {
      props.onShowDatePicker(true)
    },
  }),
  text({}),
  toDate)(
  fieldValueOrInitialIfEmpty(props)))

const formDatePicker = Component((props: any) => compose(
  fold(props),
  view({ style: styles.formDatePickerContainer }),
  concat(icon({ source: props.icon, style: { tintColor: lighterGray }})),
  concat(datePickerTouchableView),
  contramap((props: any) => ({
    onConfirm: (value: number) => {
      props.onShowDatePicker(false)
      props.input.onChange(moment(value))
    },
    onCancel: () => {
      props.onShowDatePicker(false)
    },
    date: new Date(moment(fieldValueOrInitialIfEmpty(props))),
    display: Platform.OS === 'android' ? 'calendar' : 'spinner',
    mode: 'date',
    isVisible: props.showDatePicker,
    confirmTextIOS: I18n.t('caption_ok'),
    cancelTextIOS: I18n.t('caption_cancel'),
  })))(
  fromClass(DateTimePicker)))

const startDateInput = Component((props: any) =>
  fold(props)(
    reduxFormField({
      name: FORM_KEY_DATE_FROM,
      component: formDatePicker.fold,
      icon: Images.actions.arrowRight,
      onChange: (event: any, value: any) => {
        if (value > props.endDate) {
          props.change(FORM_KEY_DATE_TO, value)
        }
      },
      onShowDatePicker: (show: boolean) => {
        props.setDatePickerName(show ? FORM_KEY_DATE_FROM : null)
      },
      showDatePicker: props.datePickerName === FORM_KEY_DATE_FROM,
    }),
  ),
)

const endDateInput = Component((props: any) =>
  fold(props)(
    reduxFormField({
      name: FORM_KEY_DATE_TO,
      component: formDatePicker.fold,
      icon: Images.actions.arrowLeft,
      onShowDatePicker: (show: boolean) => {
        props.setDatePickerName(show ? FORM_KEY_DATE_TO : null)
      },
      showDatePicker: props.datePickerName === FORM_KEY_DATE_TO,
    })
  )
)

const dateInput = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({ label: I18n.t('caption_event_creation_date') })),
  fieldBox,
  view({ style: styles.dateInputContainer }),
  reduce(concat, nothing()))(
  [startDateInput, endDateInput]))

export default Component((props: Object) => compose(
  fold(props),
  concat(__, view({ style: styles.containerAngledBorder }, nothing())),
  view({ style: styles.container }),
  reduce(concat, nothing()))([
    text({ style: styles.sectionHeaderStyle }, I18n.t('caption_basics').toUpperCase()),
    nameInput,
    dateInput,
    locationInput,
  ]))
