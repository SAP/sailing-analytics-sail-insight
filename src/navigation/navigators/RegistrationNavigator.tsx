import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'

import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
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
      screenOptions = {{...commons.headerNavigationOptions}}>
      
    </Stack.Navigator>
  )
}
