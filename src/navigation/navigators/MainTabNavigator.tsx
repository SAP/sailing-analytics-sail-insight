import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'

import IconText from 'components/IconText'
import AppSettings from 'containers/AppSettings'
import CheckIn from 'containers/CheckIn'
import Sessions from 'containers/Sessions'
import TrackingSetup from 'containers/TrackingSetup'
import Tracks from 'containers/Tracks'
import UserProfile from 'containers/UserProfile'

import Images from '@assets/Images'
import { getTabItemTitleTranslationKey } from 'helpers/texts'
import I18n from 'i18n'
import { navigateToTrackingSetup } from 'navigation'
import * as Screens from 'navigation/Screens'
import { generateNewSession } from 'services/SessionService'
import { $primaryActiveColor, $primaryTextColor, $secondaryTextColor } from 'styles/colors'
import { tab } from 'styles/commons'
import TopTabNavigator from './TopTabNavigator'


export default createBottomTabNavigator(
  {
    [Screens.TrackingSetupAction]: TrackingSetup,
    [Screens.Sessions]: TopTabNavigator(
      {
        [Screens.UserSessions]: Sessions,
        [Screens.Tracks]: Tracks,
      },
      { initialRouteName: Screens.UserSessions },
    ),
    [Screens.CheckIn]: CheckIn,
    [Screens.Account]: TopTabNavigator(
      {
        [Screens.UserProfile]: UserProfile,
        [Screens.AppSettings]: AppSettings,
      },
      { initialRouteName: Screens.UserProfile },
    ),
  },
  {
    initialRouteName: Screens.Sessions,
    backBehavior: 'none',
    swipeEnabled: false,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName = '' } = navigation.state
        let icon
        switch (routeName) {
          case Screens.TrackingSetupAction:
            icon = Images.tabs.tracking
            break
          case Screens.Sessions:
            icon = Images.tabs.sessions
            break
          case Screens.CheckIn:
            icon = Images.tabs.join
            break
          case Screens.Account:
            icon = Images.tabs.account
            break
        }

        const iconTintColor = focused ? $primaryActiveColor : tintColor

        return (
          <IconText
            iconStyle={[tab.tabItemIcon, { tintColor: iconTintColor }]}
            textStyle={[tab.bottomTabItemText, { color: tintColor }]}
            source={icon}
            iconTintColor={iconTintColor}
            iconPosition="first"
          >
            {I18n.t(getTabItemTitleTranslationKey(routeName))}
          </IconText>
        )
      },
      tabBarOnPress: (props: any = {}) => {
        if (!props.defaultHandler || !props.navigation) {
          return
        }
        if (!props.navigation.state) {
          return props.defaultHandler(navigation)
        }
        switch (navigation.state.routeName) {
          case Screens.TrackingSetupAction:
            navigateToTrackingSetup(generateNewSession())
            return
        }
        return props.defaultHandler(props.navigation)
      },
    }),
    tabBarOptions: {
      activeTintColor: $primaryTextColor,
      inactiveTintColor: $secondaryTextColor,
      style: {
        height: 56,
        backgroundColor: 'white',
      },
      showLabel: false,
      showIcon: true,
    },
  },
)
