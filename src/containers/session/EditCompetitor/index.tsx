import { always, compose, concat, objOf, reduce, flatten, isEmpty,
  map, defaultTo, reject, isNil, when, equals, pick } from 'ramda'
import { Alert, Platform, Keyboard } from 'react-native'
import { Component,  fold, nothing, fromClass, nothingAsClass,
  recomposeLifecycle as lifecycle,
  recomposeWithStateHandlers as withStateHandlers,
  recomposeWithState as withState,
  recomposeBranch as branch,
  reduxConnect as connect } from 'components/fp/component'
import { scrollView, text, view, keyboardAvoidingView, textButton } from 'components/fp/react-native'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { getFormSyncErrors, hasSubmitFailed } from 'redux-form'
import { getFormFieldValue } from 'selectors/form'
import { getRegattaCompetitor } from 'selectors/regatta'
import { getCustomScreenParamData } from 'navigation/utils'
import I18n from 'i18n'
import FormTextInput from 'components/form/FormTextInput'
import FormHandicapInput from 'components/form/FormHandicapInput'
import { button, form } from 'styles/commons'
import styles from './styles'
import { convertHandicapValue, Handicap, HandicapTypes } from 'models/TeamTemplate'
import { dataApi } from 'api'

const FORM_KEY_FORM_NAME = 'editCompetitor'
const FORM_KEY_HANDICAP = 'handicap'
const FORM_KEY_DISPLAY_NAME = 'displayName'

const mapStateToProps = (state: any, props: any) => {
  const { competitorId, session = {} } = getCustomScreenParamData(props)
  const { regattaName = '' } = session
  const competitor = getRegattaCompetitor(regattaName, competitorId)(state) || {}
  const displayName = competitor.displayName || competitor.name
  const handicap: Handicap = {
    handicapType: HandicapTypes.TimeOnTime,
    handicapValue: competitor.timeOnTimeFactor?.toString()
  }

  return {
    session,
    competitorId,
    initialValues: {
      [FORM_KEY_DISPLAY_NAME]: displayName,
      [FORM_KEY_HANDICAP]: handicap
    },
  }
}

const withIsLoading = withState('isLoading', 'setIsLoading', false)

const updateCompetitorValues = props => async (values: any) => {
  const { competitorId } = props
  const { serverUrl, regattaName } = props.session
  const api = dataApi(serverUrl)
  props.setIsLoading(true)

  const { handicap: { handicapValue, handicapType } } = values
  const ToTFactor = handicapType === HandicapTypes.Yardstick
    ? Number(convertHandicapValue(HandicapTypes.Yardstick, HandicapTypes.TimeOnTime, handicapValue))
    : Number(handicapValue)
  let handicapPromise
  if (!isNaN(ToTFactor)) {
    // Ignore errors
    handicapPromise = api.updateToTHandicap(regattaName, competitorId, ToTFactor).catch(err => {})
  }

  await Promise.all([handicapPromise])
  props.setIsLoading(false)
  props.navigation.goBack()
}

const displayNameInput = Component((props: any) => compose(
  fold(props))(
  reduxFormField({
    hint: I18n.t('text_hint_competitor_name'),
    label: I18n.t('text_placeholder_competitor_name'),
    placeholder: I18n.t('text_placeholder_competitor_name'),
    name: FORM_KEY_DISPLAY_NAME,
    component: FormTextInput,
})))

const handicapInput = Component((props: any) => compose(
  fold(props))(
  reduxFormField({
    label: I18n.t('text_handicap_label'),
    name: FORM_KEY_HANDICAP,
    component: FormHandicapInput,
})))

const saveButton = Component((props: any) => fold(props)(textButton({
  style: [button.primary, button.fullWidth, styles.saveButton],
  textStyle: button.primaryText,
  onPress: props.handleSubmit(updateCompetitorValues(props)),
  isLoading: props.isLoading,
  disabled: false,
}, text({}, I18n.t('caption_save')))))


export default Component(
  (props: any) => compose(
    fold(props),
    withIsLoading,
    connect(mapStateToProps, {}),
    reduxForm({ form: FORM_KEY_FORM_NAME }),
    view({ style: styles.container }),
    view({ style: form.formSegment }),
    reduce(concat, nothing()))([
      displayNameInput,
      handicapInput,
      saveButton,
    ]))
