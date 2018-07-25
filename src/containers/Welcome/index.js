import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import I18n from 'i18n'

const Welcome = () => (
  <View style={{
    flex: 1, justifyContent: 'center', alignItems: 'center',
  }}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', marginTop: 8 }}>
        {I18n.t('title_welcome')?.toUpperCase()}
      </Text>
    </View>
  </View>
)

export default Welcome
