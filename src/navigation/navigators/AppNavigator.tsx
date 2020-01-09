import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { $headerTintColor, $primaryButtonColor } from 'styles/colors'

import GradientNavigationBar from 'components/GradientNavigationBar'
import HeaderTitle from 'components/HeaderTitle'
import ModalBackButton from 'components/ModalBackButton'
import PasswordReset from 'containers/authentication/PasswordReset'
import EditCompetitor from 'containers/session/EditCompetitor'
import FilterSessions from 'containers/session/FilterSessions'
import JoinRegatta from 'containers/session/JoinRegatta'
import QRScanner from 'containers/session/QRScanner'
import ManeuverMonitor from 'containers/tracking/ManeuverMonitor'
import ExpertSettings from '../../containers/ExpertSettings'
import { navigateToTracking } from '../index'
import Login from 'containers/authentication/Login'

import TrackingList from 'containers/tracking/TrackingList'
import MainNavigator from './MainNavigator'
import RegistrationNavigator from './RegistrationNavigator'
import TrackingNavigator from './TrackingNavigator'


export default createStackNavigator(
  {
    [Screens.Main]: {
      screen: MainNavigator,
      navigationOptions: { header: null },
    },
    [Screens.Register]: {
      screen: RegistrationNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.TrackingList]: {
      screen: TrackingList,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
        headerLeft: null,
      }),
    },
    [Screens.TrackingNavigator]: {
      screen: TrackingNavigator,
      navigationOptions: { header: null, gesturesEnabled: false },
    },
    [Screens.QRScanner]: {
      screen: QRScanner,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$primaryButtonColor}/>,
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
    [Screens.FilterSessions]: {
      screen: FilterSessions,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.LoginFromSplash]: {
      screen: Login,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        headerLeft: null,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
      }),
    },
  },
  {
    initialRouteName: Screens.Main,
    ...commons.stackNavigatorConfig,
    mode: 'modal',
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)
