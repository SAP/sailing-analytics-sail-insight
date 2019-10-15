import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { $headerTintColor } from 'styles/colors'

import GradientNavigationBar from 'components/GradientNavigationBar'
import HeaderTitle from 'components/HeaderTitle'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
import PasswordReset from 'containers/authentication/PasswordReset'
import EditCompetitor from 'containers/session/EditCompetitor'
import JoinRegatta from 'containers/session/JoinRegatta'
import QRScanner from 'containers/session/QRScanner'
import ManeuverMonitor from 'containers/tracking/ManeuverMonitor'
import ExpertSettings from '../../containers/ExpertSettings'
import { navigateToTracking } from '../index'

import MainNavigator from './MainNavigator'
import RegistrationNavigator from './RegistrationNavigator'
import TrackingNavigator from './TrackingNavigator'


export default createStackNavigator(
  {
    [Screens.Main]: { screen: MainNavigator, navigationOptions: { header: null } },
    [Screens.Register]: {
      screen: RegistrationNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.TrackingNavigator]: {
      screen: TrackingNavigator,
      navigationOptions: { headerLeft: null, title: I18n.t('title_tracking'), gesturesEnabled: false },
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
    [Screens.EditCompetitor]: {
      screen: EditCompetitor,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.ManeuverMonitor]: {
      screen: ManeuverMonitor,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={navigationProps.state.params.heading}
            secondLine={navigationProps.state.params.subHeading}
          />
        ),
        headerRight: <ModalBackButton type="icon" onPress={navigateToTracking}/>,
        headerLeft: null,
      }),
    },
    [Screens.ModalLogin]: {
      screen: Login,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
        headerLeft: null,
      }),
    },
    [Screens.PasswordReset]: {
      screen: PasswordReset,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
        headerLeft: null,
      }),
    },
    [Screens.ExpertSettings]: {
      screen: ExpertSettings,
      navigationOptions: () => ({
        title: I18n.t('title_expert_settings'),
        headerRight: <ModalBackButton type="icon" />,
        headerLeft: null,
      }),
    },
  },
  {
    initialRouteName: Screens.Main,
    ...commons.stackNavigatorConfig,
    mode: 'modal',
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
