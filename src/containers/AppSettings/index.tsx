import React from 'react'
import { Alert, Share, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { updateGpsBulkSetting } from 'actions/settings'
import { getApiServerUrl } from 'api/config'
import { getAppVersionText, openEmailToContact, openTerms } from 'helpers/user'
import I18n from 'i18n'
import { getBulkGpsSetting } from 'selectors/settings'
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
import { readGPSFixRequestDuplicates, readGPSFixRequests } from '../../storage'
import { GPS_FIX_PROPERTY_NAME } from '../../storage/schemas'
import styles from './styles'


class AppSettings extends React.Component<ViewProps & {
  updateGpsBulkSetting: (value: boolean) => void,
  bulkGpsSetting: boolean,
}> {

  public render() {
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          {this.renderDeviceId()}
          <LineSeparator/>
          <View>
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
        </View>
        <View style={container.smallHorizontalMargin}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={openEmailToContact}
          >
            {I18n.t('caption_feedback_and_questions')}
          </TextButton>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={openTerms}
          >
            {I18n.t('title_eula')}
          </TextButton>
        </View>
        {this.renderVersionNumber()}
      </ScrollContentView>
    )
  }

  protected showServerUrl() {
    Alert.alert('Self tracking server', getApiServerUrl())
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
        <TitleLabel title={I18n.t('text_device_id')}>
          {getDeviceId()}
        </TitleLabel>
      </View>
    )
  }

}

const mapStateToProps = (state: any) => ({
  bulkGpsSetting: getBulkGpsSetting(state),
})

export default connect(mapStateToProps, { updateGpsBulkSetting })(AppSettings)
