import { createNativeStackNavigator } from '@react-navigation/native-stack'


import * as Screens from 'navigation/Screens'

import SplashScreen from 'containers/SplashScreen'
import React from 'react';
import { View } from 'react-native'
import { connect } from 'react-redux';
import AppNavigator from './AppNavigator'
import { AuthContext } from 'navigation/NavigationContext';
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import { container } from 'styles/commons'
import { isLoadingCheckIn } from 'selectors/checkIn';

const Stack = createNativeStackNavigator()

const SpinnerContainer = connect(
  (state: any) => ({ isLoading: isLoadingCheckIn(state) }))(
  (props: any) => <View style={container.main}><SpinnerOverlay visible={props.isLoading} cancelable={false}/>{props.children}</View>)

export default function SplashStack() 
{
  return (
    <SpinnerContainer>
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
    </SpinnerContainer>
  )
}
