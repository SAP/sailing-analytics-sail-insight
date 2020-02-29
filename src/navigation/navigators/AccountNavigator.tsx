import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import AppSettings from 'containers/AppSettings'
import AccountList from 'containers/user/AccountList'
import TeamList from 'containers/user/TeamList'

import UserProfile from 'containers/user/UserProfile'
import { navigateBack } from 'navigation/NavigationService';
import React from 'react';
import RegistrationNavigator from './RegistrationNavigator'

const Stack = createStackNavigator()

export default function AccountStack() 
{
  return (
    <Stack.Navigator
      initialRouteName = {Screens.AccountList}
      {...commons.stackNavigatorConfig}
      screenOptions = {{...commons.headerNavigationOptions}}
    >
      <Stack.Screen
        name = {Screens.AccountList}
        component = {AccountList}
        options = {{headerShown: false}}
      />
      <Stack.Screen
        name = {Screens.UserProfile}
        component = {UserProfile}
        options = {() => ({
          title: I18n.t('title_your_account'),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name =  {Screens.TeamList}
        component = {TeamList}
        options = {() => ({
          title: I18n.t('caption_tab_teamlist'),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.AppSettings}
        component = {AppSettings}
        options = {() => ({
          title: I18n.t('caption_tab_appsettings'),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.Register2}
        component = {RegistrationNavigator}
        options = {{headerShown: false}}
      />

    </Stack.Navigator>
  )
}

/*export default createStackNavigator(
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
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
    },
    [Screens.TeamList]: {
      screen: TeamList,
      navigationOptions: {
        title: I18n.t('caption_tab_teamlist'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
    },
    [Screens.AppSettings]: {
      screen: AppSettings,
      navigationOptions: {
        title: I18n.t('caption_tab_appsettings'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
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
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)*/
