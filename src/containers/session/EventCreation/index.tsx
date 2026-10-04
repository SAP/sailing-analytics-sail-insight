import { __, always, compose, concat, objOf, reduce, flatten, isEmpty,
  map, values, defaultTo, reject, isNil, when, equals, pick } from 'ramda'
import React from 'react'
import { Alert, Platform, Keyboard } from 'react-native'
import { getErrorDisplayMessage } from 'helpers/texts'
import ConnectedErrorDetails from 'components/ConnectedErrorDetails'
import { Component,  fold, nothing, fromClass, nothingAsClass,
  recomposeLifecycle as lifecycle,
  recomposeWithStateHandlers as withStateHandlers,
  recomposeWithState as withState,
  recomposeBranch as branch,
  reduxConnect as connect } from 'components/fp/component'
import { scrollView, text, view, keyboardAvoidingView, textButton } from 'components/fp/react-native'
import { reduxForm } from 'components/fp/redux-form'
import { getFormSyncErrors, hasSubmitFailed } from 'redux-form'
import BasicsSetup from 'containers/session/BasicsSetup'
import RacesAndScoring from 'containers/session/RacesAndScoring'
import TypeAndBoatClass from 'containers/session/TypeAndBoatClass'
import { createEventActionQueue, updateCreatingEvent } from 'actions/events'
import {
  EVENT_CREATION_FORM_NAME,
  eventCreationDataFromFormValues,
  FORM_KEY_DATE_TO,
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_DATE_FROM,
  FORM_KEY_REGATTA_TYPE,
  FORM_KEY_NUMBER_OF_RACES,
  generateInitialValues,
  validate,
  generateDefaultValues,
} from 'forms/eventCreation'
import { getFormFieldValue } from 'selectors/form'
import I18n from 'i18n'
import { selfTrackingApi } from 'api'
import { BoatClassesBody } from '../../../api/endpoints/types'
import { $LightBlue } from 'styles/colors'
import styles from './styles'
import { $declineColor } from 'styles/colors'
import IconText from 'components/IconText'
import Images from '@assets/Images'
import { isCreatingEvent } from 'selectors/event'
import { isNetworkConnected } from 'selectors/network'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const mapStateToProps = (state: any) => ({
  initialValues: generateInitialValues(),
  defaultValues: generateDefaultValues(),
  maxNumberOfDiscards: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_NUMBER_OF_RACES)(state) + 1,
  regattaType: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_REGATTA_TYPE)(state),
  endDate: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_DATE_TO)(state),
  formErrors: compose(
    values,
    when(always(equals(hasSubmitFailed(EVENT_CREATION_FORM_NAME)(state), false)), always({})),
    defaultTo({}))(
    getFormSyncErrors(EVENT_CREATION_FORM_NAME)(state)),
  isCreatingEvent: isCreatingEvent(state),
  isNetworkConnected: isNetworkConnected(state),
})

// The ScrollView and the y position of each section, so the screen can bring
// a field into view above the keyboard or after a failed submit.
const scrollViewRef: any = React.createRef()
const sectionY: { [key: string]: number } = {}
const SECTION_BASICS = 'basics'
const SECTION_TYPE = 'type'
const SECTION_RACES = 'races'

const scrollToSection = (key: string) => {
  const scrollTo = () =>
    scrollViewRef.current && scrollViewRef.current.scrollTo({ y: Math.max((sectionY[key] || 0) - 10, 0), animated: true })
  // on Android the window is resized when the keyboard opens; wait for it so
  // the scroll range is large enough
  Platform.OS === 'android' ? setTimeout(scrollTo, 300) : scrollTo()
}

const trackSection = (key: string, c: any) => view({
  onLayout: (e: any) => { sectionY[key] = e.nativeEvent.layout.y },
}, c)

const createEvent = (props: any) => async (formValues: any) => {
  const eventCreationData = eventCreationDataFromFormValues({...props.defaultValues, ...formValues})

  Keyboard.dismiss()
  props.setApiErrors([])
  props.setApiErrorRaw(null)

  if (!props.isNetworkConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }

  try {
    await props.createEventActionQueue({ eventData: eventCreationData, navigation: props.navigation }).execute()
  } catch (e) {
    props.setApiErrors([getErrorDisplayMessage(e)])
    props.setApiErrorRaw(e)
    props.updateCreatingEvent(false)
    // the error is rendered below the Create button — bring it into view
    setTimeout(() => scrollViewRef.current && scrollViewRef.current.scrollToEnd({ animated: true }), 100)
  }
}

// Scroll to the first section containing an invalid field (in screen order),
// so the field and its inline error are visible, not only the summary below.
const createEventSubmitFailed = (errors: any = {}) => {
  Keyboard.dismiss()
  const hasError = (key: string) => !!errors[key]
  const section =
    ['name', 'location', FORM_KEY_DATE_FROM].some(hasError) ? SECTION_BASICS :
    hasError(FORM_KEY_BOAT_CLASS) ? SECTION_TYPE :
    SECTION_RACES
  scrollToSection(section)
}

const formSettings = {
  validate,
  onSubmitFail: createEventSubmitFailed,
  form: EVENT_CREATION_FORM_NAME
}

const withApiErrors = compose(
  withState('apiErrors', 'setApiErrors', []),
  withState('apiErrorRaw', 'setApiErrorRaw', null))
const nothingWhenNoErrors = branch(compose(
  isEmpty,
  reject(isNil),
  flatten,
  defaultTo([]),
  values,
  pick(['formErrors', 'apiErrors'])),
  nothingAsClass)

const withBoatClasses = compose(
  withStateHandlers(null, {
    setBoatClasses: always(objOf('boatClasses')),
  }),
  lifecycle({
    componentDidMount() {
      selfTrackingApi().requestBoatClasses().then((boatClasses: BoatClassesBody[]) => {
        this.props.setBoatClasses(boatClasses)
      }).catch((err) => {
        // loaded (empty) so the boat class input does not try, and alert, again
        this.props.setBoatClasses([])
        Alert.alert(I18n.t('error_load_boat_classes'), getErrorDisplayMessage(err))
      })
    }
  }))

const withDatePickerName = withState('datePickerName', 'setDatePickerName', null)

const arrowUp = icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: 25 },
  iconStyle: { height: 12, tintColor: $declineColor } })

const errorDetails = fromClass(ConnectedErrorDetails).contramap((props: any) => ({ error: props.apiErrorRaw }))

const errorText = Component(props => compose(
  fold(props),
  concat(__, errorDetails),
  concat(arrowUp),
  view({ style: styles.errorsContainer }),
  reduce(concat, nothing()),
  map(text({ style: styles.errorText })),
  reject(isNil),
  concat(props.apiErrors))(
  props.formErrors))

const createButton = Component(
  (props: any) => compose(
    fold(props),
    view({ style: { backgroundColor: $LightBlue }}),
  )(
  textButton({
    testID: 'e2e-event-create',
    style: styles.createButton,
    textStyle: styles.createButtonText,
    onPress: props.handleSubmit(createEvent(props)),
    isLoading: props.isCreatingEvent},
    text({}, I18n.t('caption_create'))))
)

export default Component(
  (props: Object) => compose(
    fold(props),
    withBoatClasses,
    withApiErrors,
    withDatePickerName,
    connect(
      mapStateToProps,
      { createEventActionQueue, updateCreatingEvent },
      null,
      {
        pure: true,
        areStatePropsEqual: equals
      }),
    reduxForm(formSettings),
    keyboardAvoidingView({ behavior: Platform.OS === 'ios' ? 'padding' : null }),
    scrollView({ style: styles.container, keyboardShouldPersistTaps: 'always', ref: scrollViewRef }),
    view({ style: styles.content }),
    reduce(concat, nothing()))([
      trackSection(SECTION_BASICS, BasicsSetup),
      trackSection(SECTION_TYPE, TypeAndBoatClass.contramap((props: any) => ({
        ...props,
        onBoatClassFocus: () => scrollToSection(SECTION_TYPE),
      }))),
      trackSection(SECTION_RACES, RacesAndScoring),
      createButton,
      nothingWhenNoErrors(errorText)
    ]))
