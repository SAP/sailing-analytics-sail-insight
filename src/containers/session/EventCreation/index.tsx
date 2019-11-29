import { always, compose, concat, objOf, reduce } from 'ramda'
import { Alert, Image } from 'react-native'

import { Component,  fold, fromClass, nothing,
  recomposeLifecycle as lifecycle,
  recomposeWithStateHandlers as withStateHandlers,
  reduxConnect as connect } from 'components/fp/component'
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

import I18n from 'i18n'

import { selfTrackingApi } from 'api'
import { BoatClassesBody } from '../../../api/endpoints/types'

import Images from '@assets/Images'
import { getErrorDisplayMessage } from 'helpers/texts'
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

const withBoatClasses = compose(
  withStateHandlers(null, {
    setBoatClasses: always(objOf('boatClasses')),
  }),
  lifecycle({
    componentDidMount() {
      selfTrackingApi().requestBoatClasses().then((boatClasses: BoatClassesBody[]) => {
        this.props.setBoatClasses(boatClasses)
      }).catch((err) => {
        Alert.alert(I18n.t('error_load_boat_classes'), getErrorDisplayMessage(err))
      })
    },
  }))

const createButton = Component((props: any) => compose(
  fold(props),
  touchableOpacity({
    onPress: props.handleSubmit(createEvent(props)),
    style: styles.createButton,
  }))(
    text({ style: styles.createButtonText }, I18n.t('caption_create'))))

const arrowLeft = fromClass(Image).contramap(always({
  source: Images.actions.arrowLeft,
  style: { tintColor: 'white' },
}))

const backNavigation = Component((props: any) => compose(
  fold(props),
  view({ style: styles.backNavigationContainer }),
  touchableOpacity({ onPress: navigateBack }),
  view({ style: styles.backNavigationButtonContainer }),
  concat(arrowLeft))(
  text({ style: styles.backNavigationText }, I18n.t('title_event_creation'))))

export default Component((props: Object) => compose(
  fold(props),
  withBoatClasses,
  connect(mapStateToProps, { createEventActionQueue }),
  reduxForm(formSettings),
  scrollView({ style: styles.container }),
  reduce(concat, nothing()))([
    backNavigation,
    BasicsSetup,
    TypeAndBoatClass,
    RacesAndScoring,
    createButton,
  ]))
