import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'

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

const Stack = createStackNavigator()

export default function RegistrationStack()
{
  return (
    <Stack.Navigator
      initialRouteName = {Screens.RegisterCredentials}
      {...commons.stackNavigatorConfig}
      screenOptions = {{...commons.headerNavigationOptions}}
    >
      <Stack.Screen
        name = {Screens.RegisterCredentials}
        component = {RegisterCredentials}
        options = {() => ({
          ...commons.navHeaderTransparentProps,
          headerTitle: () => null,
          headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
          headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} />,
        })}
      />
      <Stack.Screen
        name = {Screens.RegisterBoat}
        component = {RegisterBoat}
        options = {{headerShown: false}}
      />
      <Stack.Screen
        name = {Screens.Login}
        component = {Login}
        options = {() => ({
          ...commons.navHeaderTransparentProps,
          headerTitle: () => null,
          headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              onPress={navigateBack}
              labelVisible={false}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}


/*export default createStackNavigator(
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
  },
  {
    initialRouteName: Screens.RegisterCredentials,
    ...commons.stackNavigatorConfig,
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)*/
