import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import { $primaryBackgroundColor } from 'styles/colors'
import { navigation as navigationStyles } from 'styles/commons'

import * as Screens from 'navigation/Screens'

import ModalBackButton from 'components/ModalBackButton'
import JoinRegatta from 'containers/session/JoinRegatta'
import QRScanner from 'containers/session/QRScanner'
import ManeuverMonitor from 'containers/tracking/ManeuverMonitor'
import Tracking from 'containers/tracking/Tracking'

import MainNavigator from './MainNavigator'
import NewSessionNavigator from './NewSessionNavigator'
import RegistrationNavigator from './RegistrationNavigator'


export default createStackNavigator(
  {
    [Screens.Main]: { screen: MainNavigator, navigationOptions: { header: null } },
    [Screens.Register]: {
      screen: RegistrationNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.NewSession]: { screen: NewSessionNavigator, navigationOptions: { header: null } },
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    [Screens.QRScanner]: {
      screen: QRScanner,
      navigationOptions: () => ({
        title: I18n.t('title_regattas'),
        headerRight: <ModalBackButton/>,
        headerLeft: null,
      }),
    },
    [Screens.JoinRegatta]: {
      screen: JoinRegatta,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.ManeuverMonitor]: {
      screen: ManeuverMonitor,
      navigationOptions: () => ({
        title: I18n.t('title_maneuver_monitor'),
        headerRight: <ModalBackButton type="icon"/>,
        headerLeft: null,
      }),
    },
  },
  {
    initialRouteName: Screens.Main,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: (options: any) => ({
      headerTitleStyle: navigationStyles.headerTitle,
      headerStyle: {
        backgroundColor: $primaryBackgroundColor,
      },
    }),
  },
)
