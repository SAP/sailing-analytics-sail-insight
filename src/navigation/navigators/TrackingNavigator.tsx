import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import { navigateBack } from 'navigation/NavigationService'
import * as Screens from 'navigation/Screens'
import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function TrackingStack()
{
  return (
    <Stack.Navigator
      initialRouteName = {Screens.WelcomeTracking}
      {...commons.stackNavigatorConfig}
      screenOptions = {{...commons.headerNavigationOptions}}
    >
      <Stack.Screen
        name = {Screens.WelcomeTracking}
        component = {WelcomeTracking}
        options = {{headerShown: false}}
      />
      <Stack.Screen
        name = {Screens.Tracking}
        component = {Tracking}
        options = {{
          gestureEnabled: false, 
          title: I18n.t('title_tracking'),
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name = {Screens.SetWind}
        component = {SetWind}
        options = {{title: I18n.t('title_set_wind')}}
      />
      <Stack.Screen
        name = {Screens.Leaderboard}
        component = {Leaderboard}
        options = {() => ({
          title: I18n.t('title_leaderboard'),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}