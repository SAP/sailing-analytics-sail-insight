import { get } from 'lodash'
import React from 'react'
import { Alert, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { connect } from 'react-redux'

import { showTestCheckInAlert } from 'actions/appDebug'
import { updateGpsBulkSetting } from 'actions/settings'
import { getApiServerUrl } from 'api/config'
import I18n from 'i18n'
import { getBulkGpsSetting } from 'selectors/settings'
import { getDeviceId } from 'services/CheckInService'
import { UPDATE_TIME_INTERVAL_IN_MILLIS } from 'services/GPSFixService'

import EditItemSwitch from 'components/EditItemSwitch'
import LineSeparator from 'components/LineSeparator'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TitleLabel from 'components/TitleLabel'

import { container } from 'styles/commons'
import styles from './styles'


class AppSettings extends React.Component<ViewProps & {
  showTestCheckInAlert: () => void,
  updateGpsBulkSetting: (value: boolean) => void,
  bulkGpsSetting: boolean,
}> {

  public render() {
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          {this.renderDeviceId()}
          <LineSeparator/>
          <EditItemSwitch
            style={styles.item}
            title={I18n.t('caption_setting_bulk_gps')}
            switchValue={this.props.bulkGpsSetting}
            onSwitchValueChange={this.props.updateGpsBulkSetting}
          >
            {I18n.t('text_setting_gps_bulk', { timeInSeconds: UPDATE_TIME_INTERVAL_IN_MILLIS / 1000 })}
          </EditItemSwitch>
        </View>
        {this.renderVersionNumber()}
      </ScrollContentView>
    )
  }

  protected showServerUrl() {
    Alert.alert('Self tracking server', getApiServerUrl())
  }

  protected renderVersionNumber = () => {
    return (
      <TouchableWithoutFeedback
        onLongPress={this.showServerUrl}
      >
        <Text style={styles.item}>
          {`v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`}
        </Text>
      </TouchableWithoutFeedback>
    )
  }

  protected renderDeviceId = () => {
    return (
      <TouchableWithoutFeedback
        onLongPress={this.props.showTestCheckInAlert}
      >
        <View style={styles.item}>
          <TitleLabel title={I18n.t('text_device_id')}>
            {getDeviceId()}
          </TitleLabel>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state: any) => ({
  bulkGpsSetting: getBulkGpsSetting(state),
})

export default connect(mapStateToProps, { showTestCheckInAlert, updateGpsBulkSetting })(AppSettings)
