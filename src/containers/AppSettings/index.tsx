import { get } from 'lodash'
import React from 'react'
import { View } from 'react-native'
import VersionNumber from 'react-native-version-number'

import Text from 'components/Text'

import ScrollContentView from 'components/ScrollContentView'
import I18n from 'i18n'
import { getDeviceId } from 'services/CheckInService'
import { container } from 'styles/commons'
import styles from './styles'


class AppSettings extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <View style={styles.item}>
            <Text>
              {I18n.t('text_device_id')}
            </Text>
            <Text>
              {getDeviceId()}
            </Text>
          </View>
        </View>
        <Text>
          {`v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`}
        </Text>
      </ScrollContentView>
    )
  }
}

export default AppSettings
