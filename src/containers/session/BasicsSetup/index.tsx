import { compose, reduce, concat, merge, mergeLeft } from 'ramda'

import I18n from 'i18n'

import { navigateToNewSessionTypeAndBoatClass } from 'navigation'
import { Component, fold, nothing, reduxConnect as connect, fromClass, contramap } from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { view, text, touchableOpacity } from 'components/fp/react-native'
import FormTextInput from 'components/form/FormTextInput'
import IconText from 'components/IconText'
import {
  eventWizardCommonFormSettings,
  FORM_KEY_DATE_FROM,
  FORM_KEY_DATE_TO,
  FORM_KEY_LOCATION,
  FORM_KEY_NAME,
  initialValues,
} from 'forms/eventCreation'
import Images from '@assets/Images'
import DatePicker from 'react-native-datepicker'

const mapStateToProps = (state: any, props: any) => ({ initialValues })

const datePickerSettings = {
  androidMode: 'spinner',
  mode: 'datetime',
  showIcon: false
}

const datePicker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    onDateChange: props.input.onChange,
    date: props.input.value,
  }))
)(fromClass(DatePicker)))

const nameInput = reduxFormField({
  label: I18n.t('text_placeholder_session_name'),
  name: FORM_KEY_NAME,
  component: FormTextInput
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

const nextButton = Component((props: Object) => compose(
  fold(props),
  touchableOpacity({
    onPress: () => navigateToNewSessionTypeAndBoatClass(),
  }),
  contramap(merge({
    source: Images.actions.arrowRight,
    alignment: 'horizontal',
    iconPosition: 'second',
    children: 'Continue',
  })))(
  fromClass(IconText)))

const formSettings = {
  ...eventWizardCommonFormSettings,
  enableReinitialize: true,       // <-- Reset the form to initial values when newly entering the form
}

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps),
  reduxForm(formSettings),
  view({ style: []}),
  reduce(concat, nothing()))([
    text({}, 'Basics'),
    nameInput,
    text({}, 'Date'),
    startDateInput,
    endDateInput,
    locationInput,
    nextButton,
  ]))
