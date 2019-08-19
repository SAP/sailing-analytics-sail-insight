import { get } from 'lodash'
import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormTeamName } from 'selectors/boat'

import HeaderTitle from 'components/HeaderTitle'
import ImageButton from 'components/ImageButton'
import ModalBackButton from 'components/ModalBackButton'
import ShareButton from 'components/ShareIconButton'
import WebView from 'components/WebView'

import Geolocation from 'containers/CourseCreation/Geolocation'
import TrackerBinding from 'containers/CourseCreation/TrackerBinding'
import EventCreation from 'containers/session/EventCreation'
import SessionDetail from 'containers/session/SessionDetail'
import RaceCourseLayout from 'containers/CourseCreation/RaceCourseLayout'
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
    [Screens.EventCreation]: {
      screen: EventCreation.fold,
      navigationOptions: () => ({
        title: I18n.t('caption_new_session'),
        headerLeft: null,
        headerRight: <ModalBackButton/>,
      }),
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
    [Screens.RaceCourseLayout]: {
      screen: RaceCourseLayout.fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine='Race course'
          />
        ),
      }),
    },
    [Screens.CourseGeolocation]: {
      screen: Geolocation
        .contramap((props: object) => ({ ...props, formSectionName: props.navigation.state.params.data.formSectionName }))
        .fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine='Geolocation'
          />
        ),
      }),
    },
    [Screens.CourseTrackerBinding]: {
      screen: TrackerBinding
        .contramap((props: object) => ({ ...props, formSectionName: props.navigation.state.params.data.formSectionName }))
        .fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine='Bind with tracker'
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
