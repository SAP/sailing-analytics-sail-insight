import { get } from 'lodash'
import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormBoatName } from 'selectors/boat'

import HeaderTitle from 'components/HeaderTitle'
import ImageButton from 'components/ImageButton'
import WebView from 'components/WebView'
import BoatDetails from 'containers/BoatDetails'
import SessionDetail from 'containers/session/SessionDetail'

import { button } from 'styles/commons'

import MainTabNavigator from './MainTabNavigator'


const boatDetailsHeader = connect((state: any) =>
  ({ text: getFormBoatName(state) }))((props: any) => <HeaderTitle firstLine={props.text}/>)

const boatDeleteHeader = (navigation: any) => get(navigation, 'state.params.paramBoatName') && (
  <ImageButton
    source={Images.actions.delete}
    style={button.actionIconNavBar}
    onPress={get(navigation, 'state.params.onOptionsPressed')}
  />
)

export default createStackNavigator(
  {
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
        headerRight: boatDeleteHeader(navigationProps),
      }),
    },
  },
  {
    initialRouteName: Screens.MainTabs,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
