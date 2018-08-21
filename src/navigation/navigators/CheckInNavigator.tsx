import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import Images from '@assets/Images'
import { buttons, container, navigation } from 'styles/commons'

import TextButton from 'components/TextButton'
import CheckIn from 'containers/CheckIn'
import QRScanner from 'containers/QRScanner'
import * as Screens from 'navigation/Screens'


export default createStackNavigator(
  {
    [Screens.CheckIn]: {
      screen: CheckIn,
      navigationOptions: (options = {}) => ({
        title: I18n.t('title_check_in'),
        headerLeft: () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />,
        headerRight: (
          <TextButton
            onPress={() => options.navigation && options.navigation.goBack && options.navigation.goBack(null)}
            textStyle={buttons.navigationBack}
          >
            {I18n.t('caption_cancel')}
          </TextButton>
        ),
      }),
    },
    [Screens.QRScanner]: {
      screen: QRScanner,
      navigationOptions: {
        title: I18n.t('title_regattas'),
      },
    },
  },
  {
    initialRouteName: Screens.CheckIn,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
