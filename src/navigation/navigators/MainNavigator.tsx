import React from 'react'
import { createStackNavigator } from 'react-navigation'

import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import HeaderTitle from 'components/HeaderTitle'
import SessionDetail from 'containers/session/SessionDetail'
import SplashScreen from 'containers/SplashScreen'

import MainTabNavigator from './MainTabNavigator'


export default createStackNavigator(
  {
    [Screens.Splash]: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.MainTabs]: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.SessionDetail]: {
      screen: SessionDetail,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={navigationProps.state.params.heading}
            secondLine={navigationProps.state.params.subHeading}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: Screens.Splash,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
