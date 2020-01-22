import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import { navigateBack } from 'navigation/NavigationService'
import * as Screens from 'navigation/Screens'
import React from 'react'
import { createStackNavigator, HeaderBackButton } from 'react-navigation'

export default createStackNavigator(
  {
    [Screens.
    WelcomeTracking]: {
      screen: WelcomeTracking,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: {
        gesturesEnabled: false,
        title: I18n.t('title_tracking'),
        headerLeft: null,
      },
    },
    [Screens.SetWind]: {
      screen: SetWind,
      navigationOptions: {
        title: I18n.t('title_set_wind'),
      },
    },
    [Screens.Leaderboard]: {
      screen: Leaderboard,
      navigationOptions: {
        title: I18n.t('title_leaderboard'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
    },
  },
  {
    initialRouteName: Screens.WelcomeTracking,
    ...commons.stackNavigatorConfig,
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)
