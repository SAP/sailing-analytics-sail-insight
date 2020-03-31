import { always, compose, concat, objOf, reduce, flatten, isEmpty,
  map, values, defaultTo, reject, isNil, when, equals, pick } from 'ramda'
import { Alert, Platform, Keyboard } from 'react-native'
import { getErrorDisplayMessage } from 'helpers/texts'
import { useHeaderHeight } from '@react-navigation/stack'
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

const icon = compose(
  fromClass(IconText).contramap,
  always)

const mapStateToProps = (state: any) => ({
  initialValues: generateInitialValues(),
  defaultValues: generateDefaultValues(),
  maxNumberOfDiscards: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_NUMBER_OF_RACES)(state) + 1,
  regattaType: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_REGATTA_TYPE)(state),
  formErrors: compose(
    values,
    when(always(equals(hasSubmitFailed(EVENT_CREATION_FORM_NAME)(state), false)), always({})),
    defaultTo({}))(
    getFormSyncErrors(EVENT_CREATION_FORM_NAME)(state)),
  isCreatingEvent: isCreatingEvent(state),
})

const createEvent = (props: any) => async (formValues: any) => {
  const eventCreationData = eventCreationDataFromFormValues({...props.defaultValues, ...formValues})

  Keyboard.dismiss()
  props.setApiErrors([])

  try {
    await props.createEventActionQueue({ eventData: eventCreationData, navigation: props.navigation }).execute()
  } catch (e) {
    props.setApiErrors([getErrorDisplayMessage(e)])
    props.updateCreatingEvent(false)
  }
}

const formSettings = {
  validate,
  form: EVENT_CREATION_FORM_NAME,
}

const withApiErrors = withState('apiErrors', 'setApiErrors', [])
const nothingWhenNoErrors = branch(compose(
  isEmpty,
  reject(isNil),
  flatten,
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
        Alert.alert(I18n.t('error_load_boat_classes'), getErrorDisplayMessage(err))
      })
    }
  }))

const arrowUp = icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: 25 },
  iconStyle: { height: 12, tintColor: $declineColor } })

const errorText = Component(props => compose(
  fold(props),
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
    connect(mapStateToProps, { createEventActionQueue, updateCreatingEvent }),
    reduxForm(formSettings),
    keyboardAvoidingView({ behavior: Platform.OS === 'ios' ? 'padding' : null, keyboardVerticalOffset: useHeaderHeight() }),
    scrollView({ style: styles.container, keyboardShouldPersistTaps: 'always', ref: props.setScrollViewRef }),
    view({ style: styles.content }),
    reduce(concat, nothing()))([
      BasicsSetup,
      TypeAndBoatClass,
      RacesAndScoring,
      createButton,
      nothingWhenNoErrors(errorText)
    ]))
