import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Image, Button } from 'react-native'

import I18n from 'i18n'

import Images from '@assets/Images'
import { container } from 'styles/commons'

import QRScanner from 'containers/QRScanner'
import CheckIn from 'containers/CheckIn'

import * as Screens from 'navigation/Screens'


export default createStackNavigator(
  {
    [Screens.CheckIn]: {
      screen: CheckIn,
      navigationOptions: options => ({
        title: I18n.t('title_check_in'),
        headerLeft: () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />,
        headerRight: (
          <Button
            onPress={() => options?.navigation?.goBack(null)}
            title={I18n.t('caption_back')}
            allCaps={false}
          />
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
  },
)
