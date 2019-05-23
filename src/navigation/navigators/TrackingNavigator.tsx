import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import Leaderboard from 'containers/tracking/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'

export default createStackNavigator(
  {
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
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
    initialRouteName: Screens.Tracking,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
