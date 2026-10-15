import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import React from 'react'
import { Alert, Image, Platform, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Logger from 'helpers/Logger'
import { showErrorAlert } from 'helpers/errorAlert'
import { readPersistentLogs } from 'helpers/PersistentLog'
import BackgroundGeolocation from 'react-native-background-geolocation'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import {
  updateServerUrlSetting,
  updateShowErrorDetailsSetting,
  changeVerboseLoggingSetting,
} from '../../actions/settings'
import TextInputForm from '../../components/base/TextInputForm'
import EditItemSwitch from '../../components/EditItemSwitch'
import * as expertSettingsForm from '../../forms/settings'
import {
  getShowErrorDetailsSetting,
  getVerboseLoggingSetting,
} from '../../selectors/settings'
import styles from './styles'

interface Props {
  updateServerUrlSetting: (value: string) => void,
  verboseLogging: boolean,
  changeVerboseLoggingSetting: (value: boolean) => Promise<void>,
  showErrorDetails: boolean,
  updateShowErrorDetailsSetting: (value: boolean) => void,
}

class ExpertSettings extends TextInputForm<Props> {

  public state = {
    emailLoading: false,
    loggingLoading: false,
    diagnosticsLoading: false,
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Image style={image.headerMedium} source={Images.header.sailors}/>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>{I18n.t('text_development_claim_01')}</Text>
            <Text style={[styles.claim, text.claimHighlighted]}>{I18n.t('text_development_claim_02')}</Text>
          </View>
        </View>
        <View style={container.largeHorizontalMargin}>
          <EditItemSwitch
            style={styles.item}
            titleStyle={{ color: 'white' }}
            title={I18n.t('text_verbose_logging')}
            testID="e2e-verbose-logging-switch"
            switchValue={this.props.verboseLogging}
            onSwitchValueChange={this.onVerboseLoggingChange}
            isLoading={this.state.loggingLoading}
          />
          <EditItemSwitch
            testID="e2e-show-error-details-switch"
            style={styles.item}
            titleStyle={{ color: 'white' }}
            title={I18n.t('text_show_error_details')}
            switchValue={this.props.showErrorDetails}
            onSwitchValueChange={this.props.updateShowErrorDetailsSetting}
          />
        </View>
        <View style={[container.largeHorizontalMargin, styles.emailContainer]}>
          <TextButton style={styles.button} textStyle={styles.buttonText}
            onPress={this.onCopyDiagnostics} isLoading={this.state.diagnosticsLoading}>
            {I18n.t('caption_copy_local_diagnostics')}
          </TextButton>
          <Text style={{ color: 'white', marginBottom: 16 }}>{I18n.t(Platform.OS === 'ios'
            ? 'text_local_diagnostics_location_ios'
            : 'text_local_diagnostics_location_android')}</Text>
          <Text style={{ color: 'white' }}>{I18n.t('text_gps_email_privacy_warning')}</Text>
          <TextButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.onLogToEmailSubmit}
            isLoading={this.state.emailLoading}
          >
            {I18n.t('caption_send_log_to_email')}
          </TextButton>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            style={styles.textInput}
            containerStyle={styles.inputContainer}
            label={I18n.t('text_base_server')}
            name={expertSettingsForm.FORM_KEY_SERVER_URL}
            component={FormTextInput}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            onChange={this.handleServerUrlChange}
            inputRef={this.handleInputRef(expertSettingsForm.FORM_KEY_SERVER_URL)}
            onSubmitEditing={this.handleOnSubmitInput(expertSettingsForm.FORM_KEY_SERVER_URL)}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
          >
            {I18n.t('caption_save')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }

  protected onSubmit = async (values: any) => {
    await this.props.updateServerUrlSetting(values[expertSettingsForm.FORM_KEY_SERVER_URL])
    this.props.navigation.goBack()
  }

  protected onVerboseLoggingChange = async (value: boolean) => {
    if (this.state.loggingLoading) return
    this.setState({ loggingLoading: true })
    try {
      await this.props.changeVerboseLoggingSetting(value)
    } catch (error) {
      Logger.warn('Failed to update verbose GPS logging', error)
      showErrorAlert(undefined, error)
    } finally {
      this.setState({ loggingLoading: false })
    }
  }

  protected onCopyDiagnostics = async () => {
    if (this.state.diagnosticsLoading) return
    this.setState({ diagnosticsLoading: true })
    try {
      const content = await readPersistentLogs()
      if (!content) {
        Alert.alert(I18n.t('text_no_local_diagnostics'))
        return
      }
      Clipboard.setString(content)
      Alert.alert(I18n.t('text_diagnostics_copied_to_clipboard'))
    } catch (error) {
      Logger.warn('Failed to copy local diagnostics', error)
      showErrorAlert(undefined, error)
    } finally {
      this.setState({ diagnosticsLoading: false })
    }
  }

  protected onLogToEmailSubmit = async () => {
    if (this.state.emailLoading) return
    this.setState({ emailLoading: true })
    try {
      await BackgroundGeolocation.logger.emailLog('support@sapsailing.com')
      Alert.alert(I18n.t('caption_success'))
      this.props.navigation.goBack()
    } catch (error) {
      Logger.warn('Failed to export GPS logs by email', error)
      showErrorAlert(undefined, error)
    } finally {
      this.setState({ emailLoading: false })
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    verboseLogging: getVerboseLoggingSetting(state),
    showErrorDetails: getShowErrorDetailsSetting(state),
  };
}

export default connect(
  mapStateToProps,
  { updateServerUrlSetting, changeVerboseLoggingSetting, updateShowErrorDetailsSetting },
)(reduxForm<{}, Props>({
  form: expertSettingsForm.EXPERT_SETTINGS_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ExpertSettings))
