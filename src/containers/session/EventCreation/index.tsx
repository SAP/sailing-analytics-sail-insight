import { compose, concat, reduce } from 'ramda'

import { Component,  fold, nothing, reduxConnect as connect } from 'components/fp/component'
import { scrollView, text, touchableOpacity } from 'components/fp/react-native'
import { reduxForm } from 'components/fp/redux-form'

import BasicsSetup from 'containers/session/BasicsSetup'
import RacesAndScoring from 'containers/session/RacesAndScoring'
import TypeAndBoatClass from 'containers/session/TypeAndBoatClass'

import { createEventActionQueue } from 'actions/events'
import {
  EVENT_CREATION_FORM_NAME,
  eventCreationDataFromFormValues,
  FORM_KEY_REGATTA_TYPE,
  initialValues,
  validate,
} from 'forms/eventCreation'
import { navigateBack } from 'navigation'
import { getFormFieldValue } from 'selectors/form'

import styles from './styles'

const mapStateToProps = (state: any) => ({
  initialValues,
  regattaType: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_REGATTA_TYPE)(state),
})

const createEvent = (props: any) => async (formValues: any) => {
  const eventCreationData = eventCreationDataFromFormValues(formValues)
  await props.createEventActionQueue(eventCreationData).execute()
  navigateBack()
}

const formSettings = {
  validate,
  form: EVENT_CREATION_FORM_NAME,
}

const createButton = Component((props: any) => compose(
  fold(props),
  touchableOpacity({
    onPress: props.handleSubmit(createEvent(props)),
    style: styles.createButton,
    })
)(text({ style: styles.createButtonText }, 'CREATE')))

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps, { createEventActionQueue }),
  reduxForm(formSettings),
  scrollView({ style: styles.container}),
  reduce(concat, nothing()))([
    BasicsSetup,
    TypeAndBoatClass,
    RacesAndScoring,
    createButton
  ]))
