import { get } from 'lodash'
import React from 'react'
import { Share } from 'react-native'
import { createStackNavigator, HeaderBackButton } from 'react-navigation'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormTeamName } from 'selectors/boat'

import HeaderIconButton from 'components/HeaderIconButton'
import HeaderTitle from 'components/HeaderTitle'
import ImageButton from 'components/ImageButton'
import WebView from 'components/WebView'

import Geolocation from 'containers/CourseCreation/Geolocation'
import RaceCourseLayout from 'containers/CourseCreation/RaceCourseLayout'
import RaceDetails from 'containers/CourseCreation/RaceDetails'
import RaceSetup from 'containers/CourseCreation/RaceSetUp'
import TrackerBinding from 'containers/CourseCreation/TrackerBinding'
import EventCreation from 'containers/session/EventCreation'
import SessionDetail, { ShareButton } from 'containers/session/SessionDetail'
import SessionDetail4Organizer, { ShareButton4Organizer } from 'containers/session/SessionDetail4Organizer'
import TeamDetails from 'containers/TeamDetails'
import FirstContact from 'containers/user/FirstContact'
import { navigateBack } from 'navigation/NavigationService'
import { button } from 'styles/commons'
import MainTabNavigator from './MainTabNavigator'

const teamDetailsHeader = connect(
  (state: any) => ({ text: getFormTeamName(state) })
)(
  (props: any) => <HeaderTitle firstLine={props.text || I18n.t('title_your_team')}/>
)

const teamDeleteHeader = (navigation: any) => get(navigation, 'state.params.paramTeamName') && (
  <ImageButton
    source={Images.actions.delete}
    style={button.actionIconNavBar}
    imageStyle={{ tintColor: 'white' }}
    onPress={get(navigation, 'state.params.onOptionsPressed')}
  />
)

const shareOnPress = (data = {}) => () => {
  const message = `${I18n.t('text_track_share')}${data.url}`
  Share.share({ message })
}

export default createStackNavigator(
  {
    [Screens.FirstContact]: {
      screen: FirstContact,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.MainTabs]: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
        backBehavior: 'none',
        gesturesEnabled: false,
      },
    },
    [Screens.EventCreation]: {
      screen: EventCreation.fold,
      navigationOptions: {
        title: I18n.t('title_event_creation'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
    },
    [Screens.SessionDetail]: {
      screen: SessionDetail.fold,
      navigationOptions: {
        title: I18n.t('title_event_details'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
        headerRight: ShareButton.fold({}),
      },
    },
    [Screens.SessionDetail4Organizer]: {
      screen: SessionDetail4Organizer.fold,
      navigationOptions: {
        title: I18n.t('title_event_details'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
        headerRight: ShareButton4Organizer.fold({}),
      },
    },
    [Screens.RaceDetails]: {
      screen: RaceDetails.fold,
      navigationOptions: {
        title: I18n.t('title_race_details'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
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
      navigationOptions: {
        title: I18n.t('title_race_course'),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      },
    },
    [Screens.CourseGeolocation]: {
      screen: Geolocation
        .contramap((props: object) => ({
          ...props,
          selectedMarkConfiguration: props.navigation.state.params.data.selectedMarkConfiguration,
          currentPosition: props.navigation.state.params.data.currentPosition,
          markPosition: props.navigation.state.params.data.markPosition }))
        .fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={I18n.t('caption_course_creator_ping_position')}
          />
        ),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      }),
    },
    [Screens.CourseTrackerBinding]: {
      screen: TrackerBinding
        .contramap(props => ({
          ...props,
          selectedMarkConfiguration: props.navigation.state.params.data.selectedMarkConfiguration,
        }))
        .fold,
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        headerTitle: (
          <HeaderTitle
            firstLine={I18n.t('caption_course_creator_bind_with_tracker')}
          />
        ),
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      }),
    },
    [Screens.TrackDetails]: {
      screen: WebView,
      navigationOptions: ({ navigation: navigationProps }: any) => {
        return {
          headerTitle: I18n.t('caption_sap_analytics_header'),
          headerRight: (
            <HeaderIconButton
              icon={Images.actions.share}
              onPress={shareOnPress(get(navigationProps, 'state.params.data'))}
            />
          ),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              title=""
              onPress={navigateBack}
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
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            title=""
            onPress={navigateBack}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: Screens.FirstContact, // if user is logged in it redirect to Screens.MainTabs
    ...commons.stackNavigatorConfig,
    defaultNavigationOptions: () => commons.headerNavigationOptions,
  },
)
