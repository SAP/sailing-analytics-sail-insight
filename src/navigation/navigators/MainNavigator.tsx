import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import Images from '@assets/Images'
import { container, navigation } from 'styles/commons'

import * as Screens from 'navigation/Screens'

import RegattaDetail from 'containers/RegattaDetail'
import Welcome from 'containers/Welcome'
import CheckInNavigator from './CheckInNavigator'


export default createStackNavigator(
  {
    [Screens.Welcome]: {
      screen: Welcome,
      navigationOptions: {
        title: I18n.t('title_regattas'),
        headerLeft: () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />,
      },
    },
    [Screens.CheckInNavigator]: {
      screen: CheckInNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.RegattaDetail]: {
      screen: RegattaDetail,
    },
  },
  {
    initialRouteName: Screens.Welcome,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
