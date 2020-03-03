import { get } from 'lodash'
import React from 'react'
import { Share } from 'react-native'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { getFormTeamName } from 'selectors/boat'
import { getSelectedMarkProperties } from 'selectors/course'
import HeaderIconButton from 'components/HeaderIconButton'
import HeaderTitle from 'components/HeaderTitle'
import ImageButton from 'components/ImageButton'
import WebView from 'components/WebView'
import Geolocation from 'containers/CourseCreation/Geolocation'
import RaceCourseLayout from 'containers/CourseCreation/RaceCourseLayout'
import TrackerBinding from 'containers/CourseCreation/TrackerBinding'
import TeamDetails from 'containers/TeamDetails'
import { navigateBack } from 'navigation/NavigationService'
import { button } from 'styles/commons'
import MainTabNavigator from './MainTabNavigator'

const TeamDetailsHeader = connect(
  (state: any) => ({ text: getFormTeamName(state) }))(
  (props: any) => <HeaderTitle firstLine={props.text || I18n.t('title_your_team')}/>)

const MarkLocationHeader = connect(
  (state: any) => {
    const markProps: any = getSelectedMarkProperties(state)

    return { markName: `(${markProps.shortName}) ${markProps.name}` }
  })(
  (props: any) => <HeaderTitle firstLine={props.markName}/>)

const teamDeleteHeader = (route: any) => (route.params.paramTeamName) && (
  <ImageButton
    source={Images.actions.delete}
    style={button.actionIconNavBar}
    imageStyle={{ tintColor: 'white' }}
    onPress={route.params?.onOptionsPressed}
  />
)

const shareOnPress = (data: any = {}) => () => {
  const message = `${I18n.t('text_track_share')}${data.url}`
  Share.share({ message })
}

const Stack = createStackNavigator()

export default function MainStack()
{
  return (
    <Stack.Navigator
      initialRouteName = {Screens.MainTabs}
      {...commons.stackNavigatorConfig}
      mode = 'modal'
      screenOptions = {{...commons.headerNavigationOptions}}
    >
      <Stack.Screen
        name = {Screens.MainTabs}
        component = {MainTabNavigator}
        options = {{headerShown: false, gestureEnabled: false}} //backBehavior on MainTab stack navigator
      />
      <Stack.Screen
        name = {Screens.RaceCourseLayout}
        component = {RaceCourseLayout.fold}
        options = {() => ({
          title: I18n.t('title_race_course'),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.CourseGeolocation}
        component = {Geolocation
                    .contramap((props: any) => ({
                      ...props,
                      selectedMarkConfiguration: props.route.params.data.selectedMarkConfiguration,
                      currentPosition: props.route.params.data.currentPosition,
                      markPosition: props.route.params.data.markPosition }))
                    .fold
                  }
        options = {() => ({
          headerTitle: () => <MarkLocationHeader/>,
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.CourseTrackerBinding}
        component = {TrackerBinding
                    .contramap((props: any) => ({
                      ...props,
                      selectedMarkConfiguration: props.route.params.data.selectedMarkConfiguration,
                    }))
                    .fold
                  }
        options = {() => ({
          headerTitle: () => (
            <HeaderTitle
              firstLine={I18n.t('caption_course_creator_bind_with_tracker')}
            />
          ),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.TrackDetails}
        component = {WebView}
        options = {({ route }) => ({
          headerTitle: I18n.t('caption_sap_analytics_header'),
          headerRight: () => (
            <HeaderIconButton
              icon={Images.actions.share}
              onPress={shareOnPress(route.params?.data)}
            />
          ),
          headerLeft: () => (
            <HeaderBackButton
              tintColor="white"
              labelVisible={false}
              onPress={navigateBack}
            />
          ),
        })}
      />
      <Stack.Screen
        name = {Screens.TeamDetails}
        component = {TeamDetails}
        options = {({ route }) => ({
          headerTitle: () => <TeamDetailsHeader/>,
          headerRight: () => teamDeleteHeader(route),
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