import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import { button, navigation } from 'styles/commons'

import TextButton from 'components/TextButton'
import QRScanner from 'containers/QRScanner'
import * as Screens from 'navigation/Screens'


export default createStackNavigator(
  {
    [Screens.QRScanner]: {
      screen: QRScanner,
      navigationOptions: (options = {}) => ({
        title: I18n.t('title_regattas'),
        headerRight: (
          <TextButton
            onPress={() => options.navigation && options.navigation.goBack && options.navigation.goBack(null)}
            textStyle={button.modalBack}
          >
            {I18n.t('caption_cancel')}
          </TextButton>
        ),
      }),
    },
  },
  {
    // initialRouteName: Screens.CheckIn,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
