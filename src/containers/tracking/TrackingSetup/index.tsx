import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'
import { ActionFunctionAny } from 'redux-actions'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { removeCheckIn } from 'actions/checkIn'
import {
  createSessionCreationQueue,
  generateSessionNameWithUserPrefix,
  shareSessionFromForm,
} from 'actions/sessions'
import { startTracking, StartTrackingAction } from 'actions/tracking'
import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import { ActionQueue } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { CheckInUpdate, TrackingSession } from 'models'
import { navigateBack, navigateToEditSession } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getLastUsedBoat } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import ImageButton from 'components/ImageButton'
import LineSeparator from 'components/LineSeparator'
import PropertyView from 'components/PropertyView'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { generateNewSession } from 'services/SessionService'
import { $primaryButtonColor } from 'styles/colors'
import { button, container, text } from 'styles/commons'
import { registration } from 'styles/components'
import styles from './styles'


interface Props {
  sessionName?: string
  shareSessionFromForm: (formName: string) => void
  generateSessionNameWithUserPrefix: (name: string) => any
  createSessionCreationQueue: (session: TrackingSession) => any
  startTracking: StartTrackingAction
  removeCheckIn: ActionFunctionAny<any>
}

class TrackingSetup extends TextInputForm<Props> {

  public state = {
    isShareSheetLoading: false,
    creationError: null,
    isCreationLoading: false,
  }

  protected creationQueue?: ActionQueue
  protected session?: TrackingSession

  private commonProps = {
    validate: [validateRequired],
  }

  public componentWillUnmount() {
    if (this.props.submitSucceeded || !this.session) {
      return
    }
    this.props.removeCheckIn({ leaderboardName: this.session.name } as CheckInUpdate)
  }

  public render() {
    const {
      isCreationLoading,
      isShareSheetLoading,
      creationError,
    } = this.state
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <View style={styles.infoContainer}>
            <Field
              label={I18n.t('text_track_name')}
              name={sessionForm.FORM_KEY_NAME}
              component={this.renderTitle}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_track_name')}
              name={sessionForm.FORM_KEY_TRACK_NAME}
              component={this.renderProperty}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_boat')}
              name={sessionForm.FORM_KEY_BOAT_NAME}
              component={this.renderProperty}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_number')}
              name={sessionForm.FORM_KEY_SAIL_NUMBER}
              component={this.renderProperty}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_class')}
              name={sessionForm.FORM_KEY_BOAT_CLASS}
              component={this.renderProperty}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_team_name')}
              name={sessionForm.FORM_KEY_TEAM_NAME}
              component={this.renderProperty}
              {...this.commonProps}
            />
            <Field
              label={I18n.t('text_privacy_setting')}
              name={sessionForm.FORM_KEY_PRIVACY_SETTING}
              component={this.renderProperty}
              {...this.commonProps}
            />
          </View>
          <View style={styles.shareContainer}>
            <LineSeparator/>
            <TextButton
              style={styles.shareButton}
              textStyle={button.textButtonText}
              onPress={this.onSharePress}
              isLoading={isShareSheetLoading}
              loadingColor={$primaryButtonColor}
            >
              {I18n.t('caption_share_session')}
            </TextButton>
            <LineSeparator/>
          </View>
        </View>
        {creationError && <Text style={registration.errorText()}>{creationError}</Text>}
        <TextButton
          style={[button.trackingAction, styles.startButton, styles.keyValue]}
          textStyle={button.trackingActionText}
          onPress={this.props.handleSubmit(this.onSubmit)}
          isLoading={isCreationLoading}
        >
          {I18n.t('caption_start').toUpperCase()}
        </TextButton>
      </ScrollContentView>
    )
  }

  protected onSharePress = async () => {
    await this.setState({ isShareSheetLoading: true })
    try {
      await this.props.shareSessionFromForm(sessionForm.SESSION_FORM_NAME)
    } catch (err) {
      Alert.alert(getErrorDisplayMessage(err))
    } finally {
      this.setState({ isShareSheetLoading: false })
    }
  }

  protected renderProperty({ label, input: { value }, meta: { touched: showError, error } }: any) {
    return (
      <PropertyView
        style={styles.keyValue}
        propertyKey={label}
        propertyValue={value || I18n.t('text_empty_value_placeholder')}
        error={showError ? error : undefined}
      />
    )
  }

  protected renderTitle = ({ input: { value } }: any) => {
    return (
      <View style={styles.titleRow}>
        <Text style={[text.claim, styles.title]}>{value}</Text>
        <ImageButton
          style={button.secondaryActionIcon}
          source={Images.actions.pen}
          onPress={this.onEditPress}
        />
      </View>
    )
  }

  protected onEditPress = () => navigateToEditSession()

  protected onSubmit = async (values: any) => {
    this.session = sessionForm.trackingSessionFromFormValues(values)
    this.session.name = this.props.generateSessionNameWithUserPrefix(this.session.name)
    if (!this.creationQueue) {
      this.creationQueue = this.props.createSessionCreationQueue(this.session) as ActionQueue
    }
    try {
      await this.setState({ isCreationLoading: true, creationError: null })
      await this.creationQueue.execute()
      navigateBack()
      this.props.startTracking(this.session.name, { skipNewTrack: true })
      return true
    } catch (err) {
      Logger.debug('Creation queue error: ', err)
      this.setState({ creationError: getErrorDisplayMessage(err) })
      return false
    } finally {
      this.setState({ isCreationLoading: false })
    }
  }
}

const mapStateToProps = (state: any, props: any) => {
  const sessionParam = getCustomScreenParamData(props) as TrackingSession
  const lastUsedBoat = getLastUsedBoat(state)
  return {
    initialValues: sessionParam ?
      sessionForm.formValuesFromTrackingSession(sessionParam) :
      generateNewSession(lastUsedBoat),
  }
}


export default connect(
  mapStateToProps,
  {
    shareSessionFromForm,
    generateSessionNameWithUserPrefix,
    createSessionCreationQueue,
    startTracking,
    removeCheckIn,
  },
)(reduxForm<{}, Props>({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate: sessionForm.validate,
})(TrackingSetup))
