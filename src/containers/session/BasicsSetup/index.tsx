import { compose, reduce, concat, merge } from 'ramda'

import I18n from 'i18n'

import { navigateToNewSessionTypeAndBoatClass } from 'navigation'
import { Component, fold, nothing, reduxConnect as connect, fromClass } from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { view, text, touchableOpacity } from 'components/fp/react-native'
import FormTextInput from 'components/form/FormTextInput'
import IconText from 'components/IconText'
import * as sessionForm from 'forms/session'
import Images from '@assets/Images'
import DatePicker from 'react-native-datepicker'

const mapStateToProps = (state: any, props: any) => {
  return {}
}

const formSettings = {
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: false,
  keepDirtyOnReinitialize: true,
}

const datePickerSettings = {
  androidMode: 'spinner',
  mode: 'datetime',
  showIcon: false
}

const nameInput = reduxFormField({
  label: I18n.t('text_placeholder_session_name'),
  name: sessionForm.FORM_KEY_NAME,
  component: FormTextInput
})

const locationInput = reduxFormField({
  label: I18n.t('text_location'),
  name: sessionForm.FORM_KEY_LOCATION,
  component: FormTextInput
})

const startDateInput = reduxFormField({
  name: 'startDate',
  component: DatePicker,
  ...datePickerSettings
})

const endDateInput = reduxFormField({
  name: 'endDate',
  component: DatePicker,
  ...datePickerSettings
})

const nextButton = Component((props: Object) => compose(
  fold(props),
  touchableOpacity({
    onPress: () => navigateToNewSessionTypeAndBoatClass()
  }))(
    fromClass(IconText).contramap(merge({
      source: Images.actions.arrowRight,
      alignment: 'horizontal',
      iconPosition: 'second',
      children: 'Continue'
    }))
  ))

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
    nextButton
  ]))
