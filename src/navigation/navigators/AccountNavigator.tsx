import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import AppSettings from 'containers/AppSettings'
import RegisterPrompt from 'containers/authentication/RegisterPrompt'
import AccountList from 'containers/user/AccountList'
import TeamList from 'containers/user/TeamList'
import UserProfile from 'containers/user/UserProfile'
import AuthComponentSelector from 'navigation/navigators/AuthComponentSelector'

export default createStackNavigator(
  {
    [Screens.AccountList]: {
      screen: AccountList,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.UserProfile]: {
      // This is so that after logging in it doesn't return to the RegisterPrompt
      // Because the Login modal is global, you cannot force it to navigate away
      // after the login
      screen: () => (
        <AuthComponentSelector
          LoggedInComponent={UserProfile}
          NotLoggedInComponent={RegisterPrompt}
        />
      ),
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
  },
  {
    initialRouteName: Screens.AccountList,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
