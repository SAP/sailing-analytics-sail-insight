import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'
import TrackingList from 'containers/tracking/TrackingList'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'

export default createStackNavigator(
  {
    [Screens.
    WelcomeTracking]: {
      screen: WelcomeTracking,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.TrackingList]: {
      screen: TrackingList,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: {
        gesturesEnabled: false,
        title: I18n.t('title_tracking'),
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
      },
    },
  },
  {
    initialRouteName: Screens.WelcomeTracking,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
