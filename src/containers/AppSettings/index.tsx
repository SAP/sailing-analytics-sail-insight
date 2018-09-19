import { get } from 'lodash'
import React from 'react'
import { Alert, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { connect } from 'react-redux'

import { insertTestCheckIns } from 'actions/checkIn'
import I18n from 'i18n'
import { getDeviceId } from 'services/CheckInService'
import { container } from 'styles/commons'
import styles from './styles'

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'


class AppSettings extends React.Component<ViewProps & {
  insertTestCheckIns: () => void,
}> {

  public connectTestCheckIns = async () => {
    Alert.alert(
      'Debug: Test check-ins',
      'Insert test check-ins?',
      [
        { text: I18n.t('caption_cancel'), style: 'cancel' },
        {
          text: I18n.t('caption_ok'), onPress: async () => {
            try {
              await this.props.insertTestCheckIns()
            } catch (err) {
              Alert.alert(err)
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  public render() {
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <TouchableWithoutFeedback
            onLongPress={this.connectTestCheckIns}
          >
            <View style={styles.item}>
              <Text>
                {I18n.t('text_device_id')}
              </Text>
              <Text>
                {getDeviceId()}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text>
          {`v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`}
        </Text>
      </ScrollContentView>
    )
  }
}

export default connect(null, { insertTestCheckIns })(AppSettings)
