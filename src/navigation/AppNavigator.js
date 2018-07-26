import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'
import { Image } from 'react-native'

import I18n from 'i18n'

import Welcome from 'containers/Welcome'
import QRScanner from 'containers/QRScanner'

import Images from '@assets/Images'
import { container } from 'styles/commons'

import * as Screens from './Screens'
import NavigationService from './NavigationService'


const MainNavigator = createStackNavigator(
  {
    [Screens.Welcome]: {
      screen: Welcome,
      navigationOptions: {
        title: I18n.t('title_regattas'),
        headerLeft: () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />,
      },
    },
    [Screens.QRScanner]: {
      screen: QRScanner,
      navigationOptions: {
        title: I18n.t('title_regattas'),
      },
    },
  },
  {
    initialRouteName: 'Welcome',
    mode: 'modal',
    headerMode: 'screen',
  },
)


class AppNavigator extends Component {
  render() {
    return (
      <MainNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    )
  }
}

export default AppNavigator
