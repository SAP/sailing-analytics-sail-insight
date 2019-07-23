import { get } from 'lodash'
import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormTeamName } from 'selectors/boat'

import HeaderTitle from 'components/HeaderTitle'
import ImageButton from 'components/ImageButton'
import ShareButton from 'components/ShareIconButton'
import WebView from 'components/WebView'
import SessionDetail from 'containers/session/SessionDetail'
import RaceDetails from 'containers/CourseCreation/RaceDetails'
import RaceSetup from 'containers/CourseCreation/RaceSetUp'
import TeamDetails from 'containers/TeamDetails'

import { button } from 'styles/commons'

import MainTabNavigator from './MainTabNavigator'


const teamDetailsHeader = connect((state: any) =>
  ({ text: getFormTeamName(state) }))((props: any) => <HeaderTitle firstLine={props.text}/>)

const teamDeleteHeader = (navigation: any) => get(navigation, 'state.params.paramTeamName') && (
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
      screen: SessionDetail.fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={navigationProps.state.params.heading}
            secondLine={navigationProps.state.params.subHeading}
          />
        ),
      }),
    },
    [Screens.RaceDetails]: {
      screen: RaceDetails.fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={navigationProps.state.params.heading}
            secondLine={navigationProps.state.params.subHeading}
          />
        ),
      }),
    },
    [Screens.RaceSetup]: {
      screen: RaceSetup.fold,
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
      navigationOptions: ({ navigation: navigationProps }: any) => {
        return {
          headerTitle: 'Track Details',
          headerRight: (
            <ShareButton
              url={get(navigationProps, 'state.params.data.url')}
              eventName={get(navigationProps, 'state.params.data.eventName')}
            />
          ),
        }
      },
    },
    [Screens.TeamDetails]: {
      screen: TeamDetails,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: teamDetailsHeader,
        headerRight: teamDeleteHeader(navigationProps),
      }),
    },
  },
  {
    initialRouteName: Screens.MainTabs,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
