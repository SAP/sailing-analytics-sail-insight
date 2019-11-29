import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import AppSettings from 'containers/AppSettings'
import AccountList from 'containers/user/AccountList'
import TeamList from 'containers/user/TeamList'

import UserProfile from 'containers/user/UserProfile'
import RegistrationNavigator from './RegistrationNavigator'

export default createStackNavigator(
  {
    [Screens.AccountList]: {
      screen: AccountList,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.UserProfile]: {
      screen: UserProfile,
      navigationOptions: {
        title: I18n.t('title_your_account'),
      },
    },
    [Screens.TeamList]: {
      screen: TeamList,
      navigationOptions: {
        title: I18n.t('caption_tab_teamlist'),
      },
    },
    [Screens.AppSettings]: {
      screen: AppSettings,
      navigationOptions: {
        title: I18n.t('caption_tab_appsettings'),
      },
    },
    [Screens.Register2]: {
      screen: RegistrationNavigator,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: Screens.AccountList,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
