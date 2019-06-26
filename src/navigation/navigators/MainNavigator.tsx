import { get } from 'lodash'
import React from 'react'
import { Share } from 'react-native'
import { createStackNavigator } from 'react-navigation'
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
import SessionDetail from 'containers/session/SessionDetail'
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

const shareOnPress = (url = '') => () => {
  const message = `${I18n.t('text_track_share')}${url}`
  Share.share({ message })
}

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
      navigationOptions: ({ navigation: navigationProps }: any) => {
        return {
          headerTitle: 'Track Details',
          headerRight: (
            <HeaderIconButton
              icon={Images.actions.share}
              onPress={shareOnPress(get(navigationProps, 'state.params.data'))}
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
