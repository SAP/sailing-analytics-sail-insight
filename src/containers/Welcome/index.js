import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import I18n from 'i18n'
import { navigateToQRScanner } from 'navigation'

class Welcome extends Component {
  startQRScanner = () => {
    console.log('REDNER')
    navigateToQRScanner()
  }

  render() {
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
      }}
      >
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
