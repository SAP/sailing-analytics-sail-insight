import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'
import { Image } from 'react-native'

import I18n from 'i18n'

import Images from '@assets/Images'
import { container, navigation } from 'styles/commons'

import Welcome from 'containers/Welcome'
import * as Screens from 'navigation/Screens'

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
    [CheckInNavigator]: {
      screen: CheckInNavigator,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: Screens.Welcome,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
