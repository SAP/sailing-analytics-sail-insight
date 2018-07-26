import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import I18n from 'i18n'
import { navigateToQRScanner } from 'navigation'

import styles from './styles'

class Welcome extends Component {
  startQRScanner = () => {
    navigateToQRScanner()
  }

  render() {
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Text>
          {I18n.t('text_more_information_at')}
        </Text>
        <Hyperlink
          linkStyle={styles.hyperLink}
          linkDefault
        >
          <Text>
            {'https://sapsailing.com'}
          </Text>
        </Hyperlink>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={this.startQRScanner}
        >
          <Text style={{ textAlign: 'center', marginTop: 8 }}>
            {I18n.t('title_welcome').toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Welcome
