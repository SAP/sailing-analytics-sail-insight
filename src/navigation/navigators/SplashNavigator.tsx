import { createNativeStackNavigator } from '@react-navigation/native-stack'


import * as Screens from 'navigation/Screens'

import SplashScreen from 'containers/SplashScreen'
import React from 'react';
import AppNavigator from './AppNavigator'
import { AuthContext } from 'navigation/NavigationContext';

const Stack = createNativeStackNavigator()

export default function SplashStack() 
{
  return (
    <AuthContext.Consumer>
      {({isLoading}) => (
      <Stack.Navigator
        initialRouteName = {Screens.Splash}
      >
        {isLoading === true ? (
        <Stack.Screen
          name = {Screens.Splash}
          component = {SplashScreen}
          options = {{headerShown: false}}
        />) : (
        <Stack.Screen
          name = {Screens.App}
          component = {AppNavigator}
          options = {{headerShown: false}}
        />)}
      </Stack.Navigator>)}
    </AuthContext.Consumer>
  )
}

/*export default createSwitchNavigator(
  {
    [Screens.Splash]: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.App]: AppNavigator,
  },
  {
    initialRouteName: Screens.Splash,
  },
))*/
