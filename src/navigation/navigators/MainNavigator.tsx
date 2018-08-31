import React from 'react'
import { createStackNavigator } from 'react-navigation'

import * as Screens from 'navigation/Screens'
import { navigation } from 'styles/commons'

import HeaderTitle from 'components/HeaderTitle'
import RegattaDetail from 'containers/RegattaDetail'
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
    [Screens.RegattaDetail]: {
      screen: RegattaDetail,
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
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
