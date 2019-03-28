import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'
import { ActionFunctionAny } from 'redux-actions'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { removeCheckIn } from 'actions/checkIn'
import {
  createSessionCreationQueue,
  CreateSessionCreationQueueAction,
  generateSessionNameWithUserPrefix,
  shareSessionRegatta,
} from 'actions/sessions'
import { startTracking, StartTrackingAction } from 'actions/tracking'
import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import { ActionQueue } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { CheckInUpdate, TrackingSession } from 'models'
import { navigateToEditSession, navigateToMain } from 'navigation'
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
  shareSessionRegatta: (leaderboardName: string) => void
  generateSessionNameWithUserPrefix: (name: string) => any
  createSessionCreationQueue: CreateSessionCreationQueueAction
  startTracking: StartTrackingAction
  removeCheckIn: ActionFunctionAny<any>
}

class TrackingSetup extends TextInputForm<Props> {

  public state = {
    isShareSheetLoading: false,
    isCreationLoading: false,
    creationError: null,
    disableActionButtons: false,
  }

  protected creationQueue?: ActionQueue
  protected session?: TrackingSession | null

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
      disableActionButtons,
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
                label={I18n.t('text_nationality')}
                name={sessionForm.FORM_KEY_NATIONALITY}
                component={this.renderProperty}
                {...this.commonProps}
            />
            <Field
              label={I18n.t('text_team_name')}
              name={sessionForm.FORM_KEY_TEAM_NAME}
              component={this.renderProperty}
              {...this.commonProps}
            />
            {/* <Field
              label={I18n.t('text_privacy_setting')}
              name={sessionForm.FORM_KEY_PRIVACY_SETTING}
              component={this.renderProperty}
              {...this.commonProps}
            /> */}
          </View>
          <View style={styles.shareContainer}>
            <LineSeparator/>
            <TextButton
              style={styles.shareButton}
              textStyle={button.textButtonText}
              onPress={this.props.handleSubmit(this.onShareSubmit)}
              isLoading={isShareSheetLoading}
              loadingColor={$primaryButtonColor}
              disabled={disableActionButtons}
              disabledStyle={styles.disabledShareButton}
            >
              {I18n.t('caption_share_session')}
            </TextButton>
            <TextButton
              style={[button.trackingAction, styles.betaButton]}
              textStyle={styles.betaButtonText}
              onPress={this.props.handleSubmit(this.showBetaAlert)}
            >
              {I18n.t('caption_beta_session')}
            </TextButton>
            <LineSeparator/>
          </View>
        </View>
        {creationError && <Text style={registration.errorText()}>{creationError}</Text>}
        <TextButton
          style={[button.trackingAction, styles.startButton, styles.keyValue]}
          textStyle={button.trackingActionText}
          onPress={this.props.handleSubmit(this.onStartSubmit)}
          isLoading={isCreationLoading}
          disabled={disableActionButtons}
        >
          {I18n.t('caption_start').toUpperCase()}
        </TextButton>
      </ScrollContentView>
    )
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

  protected createSession = async (
    values: any,
    options: {loadingFlagName?: string, isPublic?: boolean} = {},
  ) => {
    const session = sessionForm.trackingSessionFromFormValues(values)
    session.name = this.props.generateSessionNameWithUserPrefix(session.name)
    if (!this.creationQueue) {
      this.creationQueue = this.props.createSessionCreationQueue(session, { isPublic: options.isPublic }) as ActionQueue
    }
    try {
      this.setState({
        ...(options.loadingFlagName && { [options.loadingFlagName]: true }),
        creationError: null,
        disableActionButtons: true,
      })
      await this.creationQueue.execute()
      return session
    } catch (err) {
      Logger.debug('Creation queue error: ', err)
      this.setState({ creationError: getErrorDisplayMessage(err) })
      return null
    } finally {
      this.setState({
        ...(options.loadingFlagName && { [options.loadingFlagName]: false }),
        disableActionButtons: false,
      })
    }
  }

  protected onShareSubmit = async (values: any) => {
    await this.setState({ isShareSheetLoading: true })
    this.session = this.session || await this.createSession(values, { isPublic: true })
    try {
      if (!this.session) { return }
      await this.props.shareSessionRegatta(this.session.name)
    } catch (err) {
      Logger.debug(err)
      Alert.alert(getErrorDisplayMessage(err))
    } finally {
      this.setState({ isShareSheetLoading: false })
    }
    return false
  }

  protected showBetaAlert = () => {
    Alert.alert(I18n.t('caption_beta_session'), I18n.t('text_beta_session'))
  }

  protected onStartSubmit = async (values: any) => {
    this.session = this.session || await this.createSession(values, { loadingFlagName: 'isCreationLoading' })
    if (!this.session) {
      return
    }
    navigateToMain()
    this.props.startTracking(this.session.name)
  }
}

const mapStateToProps = (state: any, props: any) => {
  const sessionParam = getCustomScreenParamData(props) as TrackingSession
  const lastUsedBoat = getLastUsedBoat(state)
  return {
    initialValues: sessionParam ?
      sessionForm.formValuesFromTrackingSession(sessionParam) :
      generateNewSession(lastUsedBoat, state),
  }
}


export default connect(
  mapStateToProps,
  {
    shareSessionRegatta,
    generateSessionNameWithUserPrefix,
    createSessionCreationQueue,
    startTracking,
    removeCheckIn,
  },
)(reduxForm<{}, Props>({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: false,
  keepDirtyOnReinitialize: true,
  validate: sessionForm.validate,
})(TrackingSetup))
