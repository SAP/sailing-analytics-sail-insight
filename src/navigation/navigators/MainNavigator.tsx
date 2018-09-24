import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormBoatName } from 'selectors/boat'

import HeaderTitle from 'components/HeaderTitle'
import WebView from 'components/WebView'
import BoatDetails from 'containers/BoatDetails'
import SessionDetail from 'containers/session/SessionDetail'
import SplashScreen from 'containers/SplashScreen'

import MainTabNavigator from './MainTabNavigator'


const boatDetailsHeader = connect((state: any) =>
  ({ text: getFormBoatName(state) }))((props: any) => <HeaderTitle firstLine={props.text}/>)

export default createStackNavigator(
  {
    [Screens.Splash]: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.MainTabs]: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.SessionDetail]: {
      screen: SessionDetail,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={navigationProps.state.params.heading}
            secondLine={navigationProps.state.params.subHeading}
          />
        ),
      }),
    },
    [Screens.TrackDetails]: {
      screen: WebView,
      navigationOptions: () => ({
        headerTitle: 'Track Details',
      }),
    },
    [Screens.BoatDetails]: {
      screen: BoatDetails,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: boatDetailsHeader,
      }),
    },
  },
  {
    initialRouteName: Screens.Splash,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
