import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import React from 'react'
import { Alert, Image, View } from 'react-native'
import BackgroundGeolocation from 'react-native-background-geolocation-android'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
import {  getFormFieldValue } from 'selectors/form'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import {
  updateLeaderboardEnabledSetting,
  updateServerUrlSetting,
  updateVerboseLoggingSetting,
  updateCommunicationEnabledSetting,
  updateMtcpEnabledSetting,
  updateServerProxyUrlSetting,
  updateMasterUdpIPSetting,
  updateMasterUdpPortSetting,
  updateCommunicationSettings,
  updateMtcpSettings,
} from '../../actions/settings'
import TextInputForm from '../../components/base/TextInputForm'
import EditItemSwitch from '../../components/EditItemSwitch'
import * as expertSettingsForm from '../../forms/settings'
import {
  getLeaderboardEnabledSetting,
  getServerUrlSetting,
  getVerboseLoggingSetting,
  getCommunicationSetting,
  getMtcpSetting,
  getServerProxyUrlSetting,
  getMasterUdpIP,
  getMasterUdpPort,
  getMasterUdpPorts,
  getDefaultAnyServerUrl,
} from '../../selectors/settings'
import styles from './styles'

interface Props {
  formServer?: string,
  updateServerUrlSetting: (value: string) => void,
  updateServerProxyUrlSetting: (value: string) => void,
  updateMasterUdpIPSetting: (value: string) => void,
  updateMasterUdpPortSetting: (value: number) => void,
  updateCommunicationSettings: () => void,
  updateMtcpSettings: () => void,
  verboseLogging: boolean,
  communicationSetting: boolean,
  mtcpSetting: boolean,
  updateVerboseLoggingSetting: (value: boolean) => void,
  updateCommunicationEnabledSetting: (value: boolean) => void,
  updateMtcpEnabledSetting: (value: boolean) => void,
  leaderboardEnabled: boolean,
  updateLeaderboardEnabledSetting: (value: boolean) => void,
  masterUdpPorts: any,
}

class ExpertSettings extends TextInputForm<Props> {

  public state = {
    emailLoading: false,
  }

  public handleServerUrlChange = (event: any, value: any) => {
    if (this.props.masterUdpPorts[value]) {
      this.props.change(expertSettingsForm.FORM_KEY_MASTER_PORT, this.props.masterUdpPorts[value])
    } else {
      this.props.change(expertSettingsForm.FORM_KEY_MASTER_PORT, this.props.masterUdpPorts[getDefaultAnyServerUrl()])
    }
  }

  public renderProxySettings()
  {
    return (
      <View>
        <Field
          style={styles.textInput}
          containerStyle={styles.inputContainer}
          label={I18n.t('text_server_proxy')}
          name={expertSettingsForm.FORM_KEY_PROXY_URL}
          component={FormTextInput}
          validate={[validateRequired]}
          keyboardType={'default'}
          returnKeyType="next"
          inputRef={this.handleInputRef(expertSettingsForm.FORM_KEY_PROXY_URL)}
          onSubmitEditing={this.handleOnSubmitInput(expertSettingsForm.FORM_KEY_PROXY_URL)}
            />
        <Field
          style={styles.textInput}
          containerStyle={styles.inputContainer}
          label={I18n.t('text_server_udp_ip')}
          name={expertSettingsForm.FORM_KEY_MASTER_IP}
          component={FormTextInput}
          validate={[validateRequired]}
          keyboardType={'default'}
          returnKeyType="next"
          inputRef={this.handleInputRef(expertSettingsForm.FORM_KEY_MASTER_IP)}
          onSubmitEditing={this.handleOnSubmitInput(expertSettingsForm.FORM_KEY_MASTER_IP)}
          />
        <Field
          style={styles.textInput}
          containerStyle={styles.inputContainer}
          label={I18n.t('text_server_udp_port')}
          name={expertSettingsForm.FORM_KEY_MASTER_PORT}
          component={FormTextInput}
          validate={[validateRequired]}
          keyboardType={'numeric'}
          returnKeyType="next"
          inputRef={this.handleInputRef(expertSettingsForm.FORM_KEY_MASTER_PORT)}
          onSubmitEditing={this.handleOnSubmitInput(expertSettingsForm.FORM_KEY_MASTER_PORT)}
          />
      </View>
    )
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
        {/* <View style={container.largeHorizontalMargin}>
          <EditItemSwitch
            style={styles.item}
            titleStyle={{ color: 'white' }}
            title={I18n.t('text_leaderboard_enabled_setting')}
            switchValue={this.props.leaderboardEnabled}
            onSwitchValueChange={this.props.updateLeaderboardEnabledSetting}
          />
        </View> */}
        <View style={container.largeHorizontalMargin}>
          <EditItemSwitch
            style={styles.item}
            titleStyle={{ color: 'white' }}
            title={I18n.t('text_verbose_logging')}
            switchValue={this.props.verboseLogging}
            onSwitchValueChange={this.props.updateVerboseLoggingSetting}
          />
          {false && 
          <EditItemSwitch
              style={styles.item}
              titleStyle={{ color: 'white' }}
              title={I18n.t('text_mtcp_setting')}
              switchValue={this.props.mtcpSetting}
              onSwitchValueChange={this.props.updateMtcpEnabledSetting}
          />}
          <EditItemSwitch
              style={styles.item}
              titleStyle={{ color: 'white' }}
              title={I18n.t('text_communication_setting')}
              switchValue={this.props.communicationSetting}
              onSwitchValueChange={this.props.updateCommunicationEnabledSetting}
          />
          {this.props.communicationSetting && this.renderProxySettings()}
        </View>
        <View style={[container.largeHorizontalMargin, styles.emailContainer]}>
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
    if (this.props.communicationSetting || this.props.mtcpSetting) {
      await this.props.updateServerProxyUrlSetting(values[expertSettingsForm.FORM_KEY_PROXY_URL])
    }
    if (this.props.communicationSetting) {
      await this.props.updateMasterUdpIPSetting(values[expertSettingsForm.FORM_KEY_MASTER_IP])
      await this.props.updateMasterUdpPortSetting(values[expertSettingsForm.FORM_KEY_MASTER_PORT])
      this.props.updateCommunicationSettings()
    }
    if (this.props.mtcpSetting) {
      this.props.updateMtcpSettings()
    }
    this.props.navigation.goBack()
  }

  protected onLogToEmailSubmit = () => {
    this.setState({ emailLoading: true })
    BackgroundGeolocation.logger.emailLog('support@sapsailing.com').then(() => {
      Alert.alert(I18n.t('caption_success'))
      this.props.navigation.goBack()
    }).catch(() => {
      Alert.alert(I18n.t('error_unknown'))
      this.setState({ emailLoading: false })
    })
  }
}

const mapStateToProps = (state: any) => {
  return {
    formServer: getFormFieldValue(expertSettingsForm.EXPERT_SETTINGS_FORM_NAME,
                                  expertSettingsForm.FORM_KEY_SERVER_URL)(state),
    initialValues: {
      [expertSettingsForm.FORM_KEY_SERVER_URL]: getServerUrlSetting(state),
      [expertSettingsForm.FORM_KEY_PROXY_URL]: getServerProxyUrlSetting(state),
      [expertSettingsForm.FORM_KEY_MASTER_IP]: getMasterUdpIP(state),
      [expertSettingsForm.FORM_KEY_MASTER_PORT]: getMasterUdpPort(state),
    },
    verboseLogging: getVerboseLoggingSetting(state),
    communicationSetting: getCommunicationSetting(state),
    mtcpSetting: getMtcpSetting(state),
    leaderboardEnabled: getLeaderboardEnabledSetting(state),
    masterUdpPorts: getMasterUdpPorts(state),
  }
}

export default connect(
  mapStateToProps,
  { updateServerUrlSetting, updateVerboseLoggingSetting, updateLeaderboardEnabledSetting, updateCommunicationEnabledSetting, updateMtcpEnabledSetting,
  updateServerProxyUrlSetting, updateMasterUdpIPSetting, updateMasterUdpPortSetting, updateCommunicationSettings, updateMtcpSettings, change },
)(reduxForm<{}, Props>({
  form: expertSettingsForm.EXPERT_SETTINGS_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ExpertSettings))
