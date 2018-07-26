import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Image } from 'react-native'

import I18n from 'i18n'

import Images from '@assets/Images'
import { container, navigation, buttons } from 'styles/commons'

import QRScanner from 'containers/QRScanner'
import CheckIn from 'containers/CheckIn'

import TextButton from 'components/TextButton'

import * as Screens from 'navigation/Screens'


export default createStackNavigator(
  {
    [Screens.CheckIn]: {
      screen: CheckIn,
      navigationOptions: options => ({
        title: I18n.t('title_check_in'),
        headerLeft: () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />,
        headerRight: (
          <TextButton
            onPress={() => options?.navigation?.goBack(null)}
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
