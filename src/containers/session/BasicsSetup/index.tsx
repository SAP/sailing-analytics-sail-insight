import { compose, concat, mergeLeft, reduce } from 'ramda'

import I18n from 'i18n'

import FormTextInput from 'components/form/FormTextInput'
import { Component, contramap, fold, fromClass, nothing } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DATE_FROM,
  FORM_KEY_DATE_TO,
  FORM_KEY_LOCATION,
  FORM_KEY_NAME,
} from 'forms/eventCreation'
import DatePicker from 'react-native-datepicker'

const datePickerSettings = {
  androidMode: 'spinner',
  mode: 'datetime',
  showIcon: false,
}

const datePicker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    onDateChange: props.input.onChange,
    date: props.input.value,
  })),
)(fromClass(DatePicker)))

const nameInput = reduxFormField({
  label: I18n.t('text_placeholder_session_name'),
  name: FORM_KEY_NAME,
  component: FormTextInput,
})

const locationInput = reduxFormField({
  label: I18n.t('text_location'),
  name: FORM_KEY_LOCATION,
  component: FormTextInput,
})

const startDateInput = reduxFormField({
  name: FORM_KEY_DATE_FROM,
  component: datePicker.fold,
  ...datePickerSettings,
})

const endDateInput = reduxFormField({
  name: FORM_KEY_DATE_TO,
  component: datePicker.fold,
  ...datePickerSettings,
})

export default Component((props: Object) => compose(
  fold(props),
  view({ style: [] }),
  reduce(concat, nothing()))([
    text({}, 'Basics'),
    nameInput,
    text({}, 'Date'),
    startDateInput,
    endDateInput,
    locationInput,
  ]))
