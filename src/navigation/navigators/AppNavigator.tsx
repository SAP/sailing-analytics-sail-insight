import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import { navigation as navigationStyles } from 'styles/commons'

import * as Screens from 'navigation/Screens'

import ModalBackButton from 'components/ModalBackButton'
import Tracking from 'containers/Tracking'
import TrackingSetup from 'containers/TrackingSetup'

import CheckInNavigator from './CheckInNavigator'
import MainNavigator from './MainNavigator'
import RegistrationNavigator from './RegistrationNavigator'


export default createStackNavigator(
  {
    [Screens.Main]: { screen: MainNavigator, navigationOptions: { header: null } },
    [Screens.CheckInNavigator]: {
      screen: CheckInNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.Register]: {
      screen: RegistrationNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    [Screens.TrackingSetup]: {
      screen: TrackingSetup,
      navigationOptions: () => ({
        title: I18n.t('caption_new_session'),
        headerLeft: null,
        headerRight: <ModalBackButton/>,
      }),
    },
  },
  {
    initialRouteName: Screens.Main,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: (options: any) => ({
      headerTitleStyle: navigationStyles.headerTitle,
    }),
  },
)
