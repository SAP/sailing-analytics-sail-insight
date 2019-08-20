import { always, compose, concat, reduce } from 'ramda'
import { Image } from 'react-native'

import { Component,  fold, fromClass, nothing, reduxConnect as connect } from 'components/fp/component'
import { scrollView, text, touchableOpacity, view } from 'components/fp/react-native'
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

import Images from '@assets/Images'
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

const arrowLeft = fromClass(Image).contramap(always({
  source: Images.actions.arrowLeft,
  style: { tintColor: 'white' },
}))

const backNavigation = Component((props: any) => compose(
  fold(props),
  view({ style: styles.backNavigationContainer }),
  touchableOpacity({ onPress: navigateBack }),
  view({ style: styles.backNavigationButtonContainer }),
  concat(arrowLeft)
)(text({ style: styles.backNavigationText }, 'Event overview')))

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps, { createEventActionQueue }),
  reduxForm(formSettings),
  scrollView({ style: styles.container}),
  reduce(concat, nothing()))([
    backNavigation,
    BasicsSetup,
    TypeAndBoatClass,
    RacesAndScoring,
    createButton
  ]))
