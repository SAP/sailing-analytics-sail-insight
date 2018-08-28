import React from 'react'
import { View } from 'react-native'

import Text from 'components/Text'

import I18n from 'i18n'
import { getDeviceId } from 'services/CheckInService'
import { container } from 'styles/commons'
import styles from './styles'


class AppSettings extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <View style={container.main}>
        <View style={styles.item}>
          <Text>
            {I18n.t('text_device_id')}
          </Text>
          <Text>
            {getDeviceId()}
          </Text>
        </View>
      </View>
    )
  }
}

export default AppSettings
