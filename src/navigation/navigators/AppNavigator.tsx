import GradientNavigationBar from 'components/GradientNavigationBar'
import HeaderTitle from 'components/HeaderTitle'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
import PasswordReset from 'containers/authentication/PasswordReset'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import EditCompetitor from 'containers/session/EditCompetitor'
import FilterSessions from 'containers/session/FilterSessions'
import ManeuverMonitor from 'containers/tracking/ManeuverMonitor'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import { navigateBack } from 'navigation/NavigationService'
import * as Screens from 'navigation/Screens'
import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import { $headerTintColor } from 'styles/colors'
import ExpertSettings from '../../containers/ExpertSettings'
import { navigateToTracking } from '../index'
import RegistrationNavigator from './RegistrationNavigator'
import TrackingNavigator from './TrackingNavigator'
import { AuthContext, SessionsContext } from 'navigation/NavigationContext'
import FirstContact from 'containers/user/FirstContact'

const Stack = createStackNavigator()

export default function AppStack()
{
  return (
    <SessionsContext.Provider value = {{forTracking: true}}>
      <AuthContext.Consumer>
        {({isLoading, isLoggedIn}) => (
          <Stack.Navigator
            {...commons.stackNavigatorConfig}
            mode = 'modal'
            screenOptions = {{...commons.headerNavigationOptions}}>
                <Stack.Screen
                  name = {Screens.TrackingNavigator}
                  component = {TrackingNavigator}
                  options = {{headerShown: false, gestureEnabled: false}}
                />
                <Stack.Screen
                  name = {Screens.ManeuverMonitor}
                  component = {ManeuverMonitor}
                  options = {(route: any) => ({
                    headerTitle: () => (
                      <HeaderTitle
                        firstLine={route.params.heading}
                        secondLine={route.params.subHeading}
                      />
                    ),
                    headerRight: () => <ModalBackButton type="icon" onPress={navigateToTracking}/>,
                    headerLeft: () => null,
                  })}
                />
                <Stack.Screen
                  name = {Screens.ExpertSettings}
                  component = {ExpertSettings}
                  options = {() => ({
                    title: I18n.t('title_expert_settings'),
                    headerRight: () => <ModalBackButton type="icon" />,
                    headerLeft: () => null,
                  })}
                />
                <Stack.Screen
                  name = {Screens.FilterSessions}
                  component = {FilterSessions}
                  options = {{headerShown: false}}
                />
                <Stack.Screen
                  name = {Screens.RegisterBoat}
                  component = {RegisterBoat}
                  options = {() => ({
                    title: I18n.t('title_your_team'),
                    headerLeft: () => null 
                  })}
                />
                <Stack.Screen
                  name = {Screens.FirstContact}
                  component = {FirstContact}
                  options = {{headerShown: false}}
                />
                  <Stack.Screen
                    name = {Screens.PasswordReset}
                    component = {PasswordReset}
                    options = {() => ({
                      ...commons.navHeaderTransparentProps,
                      title: '',
                      headerBackground: (props: any) => <GradientNavigationBar transparent="false" {...props} />,
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
        )}
      </AuthContext.Consumer>
    </SessionsContext.Provider>
  )
}
