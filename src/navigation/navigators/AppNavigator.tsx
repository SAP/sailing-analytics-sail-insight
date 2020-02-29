import GradientNavigationBar from 'components/GradientNavigationBar'
import HeaderTitle from 'components/HeaderTitle'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
import PasswordReset from 'containers/authentication/PasswordReset'
import EditCompetitor from 'containers/session/EditCompetitor'
import FilterSessions from 'containers/session/FilterSessions'
import JoinRegatta from 'containers/session/JoinRegatta'
import QRScanner from 'containers/session/QRScanner'
import ManeuverMonitor from 'containers/tracking/ManeuverMonitor'
import TrackingList from 'containers/tracking/TrackingList'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import { navigateBack } from 'navigation/NavigationService'
import * as Screens from 'navigation/Screens'
import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import { $headerTintColor, $primaryButtonColor } from 'styles/colors'
import ExpertSettings from '../../containers/ExpertSettings'
import { navigateToTracking } from '../index'
import MainNavigator from './MainNavigator'
import RegistrationNavigator from './RegistrationNavigator'
import TrackingNavigator from './TrackingNavigator'
import { AuthContext } from 'navigation/NavigationContext'
import FirstContact from 'containers/user/FirstContact'

const Stack = createStackNavigator()

export default function AppStack()
{
  return (
    <AuthContext.Consumer>
      {({isLoading, isLoggedIn}) => (
        <Stack.Navigator
          initialRouteName = {Screens.Main}
          {...commons.stackNavigatorConfig}
          mode = 'modal'
          screenOptions = {{...commons.headerNavigationOptions}}
        >
          {isLoggedIn === true ? (
            <>
              <Stack.Screen
                name = {Screens.Main}
                component = {MainNavigator}
                options = {{headerShown: false}}
              />
              <Stack.Screen
                name = {Screens.TrackingList}
                component = {TrackingList}
                options = {() => ({
                  ...commons.navHeaderTransparentProps,
                  title: '',
                  headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
                  headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} />,
                  headerLeft: () => null,
                })}
              />
              <Stack.Screen
                name = {Screens.TrackingNavigator}
                component = {TrackingNavigator}
                options = {{headerShown: false, gestureEnabled: false}}
              />
              <Stack.Screen
                name = {Screens.QRScanner}
                component = {QRScanner}
                options = {() => ({
                  ...commons.navHeaderTransparentProps,
                  title: '',
                  headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
                  headerRight: () => <ModalBackButton type="icon" iconColor={$primaryButtonColor}/>,
                  headerLeft: () => null,
                })}
              />
              <Stack.Screen
                name = {Screens.JoinRegatta}
                component = {JoinRegatta}
                options = {{headerShown: false}}
              />
              <Stack.Screen
                name = {Screens.EditCompetitor}
                component = {EditCompetitor}
                options = {{headerShown: false}}
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
            </>
          ) : (
            <>
              <Stack.Screen
                name = {Screens.FirstContact}
                component = {FirstContact}
                options = {{headerShown: false}}
              />
              <Stack.Screen
                name = {Screens.Register}
                component = {RegistrationNavigator}
                options = {{headerShown: false}}
              />
              <Stack.Screen
                  name = {Screens.LoginFromSplash}
                  component = {Login}
                  options = {() => ({
                    title: '',
                    ...commons.navHeaderTransparentProps,
                    headerLeft: () => null,
                    headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} />,
                  })}
                />
                <Stack.Screen
                  name = {Screens.QRScanner}
                  component = {QRScanner}
                  options = {() => ({
                    ...commons.navHeaderTransparentProps,
                    title: '',
                    headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
                    headerRight: () => <ModalBackButton type="icon" iconColor={$primaryButtonColor}/>,
                    headerLeft: () => null,
                  })}
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
              </>
          )}
        </Stack.Navigator>
      )}
    </AuthContext.Consumer>
  )
}

/*function createStackNavigator(
  {
    [Screens.Main]: {
      screen: MainNavigator,
      navigationOptions: {
        header: null,
      },
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
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
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
)*/
