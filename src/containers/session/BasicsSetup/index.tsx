import { __, compose, concat, mergeLeft, reduce } from 'ramda'
import { TextInput } from 'react-native'

import I18n from 'i18n'

import { Component, contramap, fold, fromClass, nothing } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DATE_FROM,
  FORM_KEY_DATE_TO,
  FORM_KEY_LOCATION,
  FORM_KEY_NAME,
} from 'forms/eventCreation'

import IconText from 'components/IconText'
import DatePicker from 'react-native-datepicker'

import Images from '@assets/Images'
import styles from './styles'


const fieldBox = (child: any) => Component((props: any) => compose(
  fold(props),
  view({ style: styles.fieldBoxContainer }),
  reduce(concat, nothing()))([
    text({ style: styles.fieldBoxLabel }, props.label),
    child,
  ]))

const boxedTextInput = fieldBox(
  fromClass(TextInput).contramap((props: any) => ({
    value: props.input.value,
    onChangeText: props.input.onChange,
    underlineColorAndroid: '#C5C5C5',
  })),
)

const nameInput = reduxFormField({
  label: I18n.t('text_placeholder_session_name'),
  name: FORM_KEY_NAME,
  component: boxedTextInput.fold,
})

const locationInput = reduxFormField({
  label: I18n.t('text_location'),
  name: FORM_KEY_LOCATION,
  component: boxedTextInput.fold,
})

const arrowIcon = fromClass(IconText).contramap({
  source: Images.actions.arrowRight,
})

const formDatePicker = Component((props: any) => compose(
  fold(props),
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
    style: {
      width: '100%',
      flex: 1,
    }
  }))
)(fromClass(DatePicker)))

const startDateInput = reduxFormField({
  name: FORM_KEY_DATE_FROM,
  component: formDatePicker.fold,
})

const endDateInput = reduxFormField({
  name: FORM_KEY_DATE_TO,
  component: formDatePicker.fold,
})

const dateInput = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({ label: 'Date' })),
  fieldBox,
  view({ style: styles.dateInputContainer }),
  reduce(concat, nothing())
)([startDateInput, endDateInput]))

export default Component((props: Object) => compose(
  fold(props),
  view({ style: styles.container }),
  reduce(concat, nothing()))([
    text({ style: styles.sectionHeaderStyle }, 'BASICS'),
    nameInput,
    dateInput,
    locationInput,
  ]))
