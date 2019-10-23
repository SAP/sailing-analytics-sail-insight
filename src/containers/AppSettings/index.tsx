import React from 'react'
import { Alert, Share, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { updateGpsBulkSetting, changeAnalyticsSetting } from 'actions/settings'
import { getApiServerUrl } from 'api/config'
import { getAppVersionText, openEmailToContact, openPrivacyPolicy, openTerms } from 'helpers/user'
import I18n from 'i18n'
import { getBulkGpsSetting, getEnableAnalyticsSettings } from 'selectors/settings'
import { getDeviceId } from 'services/CheckInService'
import { BULK_UPDATE_TIME_INTERVAL_IN_MILLIS } from 'services/GPSFixService'

import EditItemSwitch from 'components/EditItemSwitch'
import LineSeparator from 'components/LineSeparator'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TitleLabel from 'components/TitleLabel'

import { button, container } from 'styles/commons'
import { registration } from 'styles/components'
import Logger from '../../helpers/Logger'
import { navigateToExpertSettings } from '../../navigation'
import { readGPSFixRequestDuplicates, readGPSFixRequests } from '../../storage'
import { GPS_FIX_PROPERTY_NAME } from '../../storage/schemas'
import styles from './styles'


class AppSettings extends React.Component<ViewProps & {
  updateGpsBulkSetting: (value: boolean) => void,
  bulkGpsSetting: boolean,
  enableAnalytics: boolean,
  changeAnalyticsSetting: (value: boolean) => void,
}> {

  public state = {
    expertSettingsClickCount: 0,
  }

  public render() {
    return (
      <ScrollContentView>
        <View style={styles.container}>
          {this.renderDeviceId()}
          <View>
            <EditItemSwitch
              style={styles.item}
              title={I18n.t('caption_setting_analytics')}
              switchValue={this.props.enableAnalytics}
              onSwitchValueChange={this.props.changeAnalyticsSetting}
            />
            <EditItemSwitch
              style={styles.item}
              title={I18n.t('caption_setting_bulk_gps')}
              switchValue={this.props.bulkGpsSetting}
              onSwitchValueChange={this.props.updateGpsBulkSetting}
            />
            <Text style={styles.item}>
              {I18n.t('text_setting_gps_bulk', { timeInSeconds: BULK_UPDATE_TIME_INTERVAL_IN_MILLIS / 1000 })}
            </Text>
          </View>
          <TextButton
            style={[styles.button, styles.firstButton]}
            textStyle={styles.buttonContent}
            onPress={openEmailToContact}
          >
            {I18n.t('caption_feedback_and_questions')}
          </TextButton>
          <TextButton
            style={styles.button}
            textStyle={styles.buttonContent}
            onPress={openTerms}
          >
            {I18n.t('title_eula')}
          </TextButton>
          <TextButton
            style={[styles.button, styles.lastButton]}
            textStyle={styles.buttonContent}
            onPress={openPrivacyPolicy}
          >
            {I18n.t('title_privacy_policy')}
          </TextButton>
        </View>
        {this.renderVersionNumber()}
      </ScrollContentView>
    )
  }

  protected showDeveloperDialog = () => {
    const mainServerUrl = getApiServerUrl()
    const numberOfunsentGPSFixes = readGPSFixRequests().length
    const numberOfGPSFixes = readGPSFixRequestDuplicates().length
    // tslint:disable-next-line
    const message = `Main server url:\n${mainServerUrl}\n\nGPS-Fixes of last tracking:\nNumber of unsent gps fixes=${numberOfunsentGPSFixes}\nNumber of gps fixes=${numberOfGPSFixes}`
    Alert.alert(
      'Development Options',
      message,
      [
        {
          text: 'Export all GPS fixes', onPress: async () => {
            this.exportGpsFixes()
          },
        },
      ],
      { cancelable: true },
    )
  }

  protected handleExpertSettings = () => {
    if (this.state.expertSettingsClickCount >= 14) {
      this.setState({ expertSettingsClickCount: 0 })
      navigateToExpertSettings()
    } else {
      this.setState({ expertSettingsClickCount: this.state.expertSettingsClickCount + 1 })
    }
  }

  protected exportGpsFixes = () => {
    const fixRequests = readGPSFixRequestDuplicates()
    const data: any[] = []

    fixRequests.forEach((fixRequest: any) => {
      data.push(fixRequest[GPS_FIX_PROPERTY_NAME])
    })

    const myObjStr = JSON.stringify(data, undefined, 2)

    Share.share({ title: 'GPS-Fixes', message: myObjStr.toString() })
      .then(result => Logger.debug(result))
      .catch(errorMsg => Logger.debug(errorMsg))
  }

  protected renderVersionNumber = () => {
    return (
      <TouchableWithoutFeedback
        onLongPress={this.showDeveloperDialog}
        onPress={this.handleExpertSettings}
      >
        <Text style={styles.item}>
          {getAppVersionText()}
        </Text>
      </TouchableWithoutFeedback>
    )
  }

  protected renderDeviceId = () => {
    return (
      <View style={styles.item}>
        <Text style={styles.boldText}>{I18n.t('text_device_id').toUpperCase()}</Text>
        <Text style={styles.text}>{getDeviceId()}</Text>
      </View>
    )
  }

}

const mapStateToProps = (state: any) => ({
  bulkGpsSetting: getBulkGpsSetting(state),
  enableAnalytics: getEnableAnalyticsSettings(state)
})

export default connect(mapStateToProps, { updateGpsBulkSetting, changeAnalyticsSetting })(AppSettings)
