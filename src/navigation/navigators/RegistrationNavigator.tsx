import React from 'react'
import { createStackNavigator, HeaderBackButton } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
import PasswordReset from 'containers/authentication/PasswordReset'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import RegisterCredentials from 'containers/authentication/RegisterCredentials'

import { navigateBack } from 'navigation/NavigationService';
import { $headerTintColor } from 'styles/colors'


export default createStackNavigator(
  {
    [Screens.RegisterCredentials]: {
      screen: RegisterCredentials,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
      }),
    },
    [Screens.RegisterBoat]: {
      screen: RegisterBoat,
      navigationOptions: () => ({
        title: I18n.t('title_your_team'),
        headerLeft: null,
      }),
    },
    [Screens.Login]: {
      screen: Login,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      }),
    },
    [Screens.PasswordReset]: {
      screen: PasswordReset,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: Screens.RegisterCredentials,
    ...commons.stackNavigatorConfig,
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)
