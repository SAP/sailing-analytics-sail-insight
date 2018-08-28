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
import * as Screens from 'navigation/Screens'
import { $tabNavigationActiveIconColor, $tabNavigationActiveTextColor, $tabNavigationInactiveColor } from 'styles/colors'
import tabs from 'styles/commons/tabs'
import TopTabNavigator from './TopTabNavigator'


export default createBottomTabNavigator(
  {
    [Screens.TrackingSetup]: TrackingSetup,
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
          case Screens.TrackingSetup:
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

        const iconTintColor = focused ? $tabNavigationActiveIconColor : tintColor

        return (
          <IconText
            iconStyle={[tabs.tabItemIcon, { tintColor: iconTintColor }]}
            textStyle={[tabs.bottomTabItemText, { color: tintColor }]}
            source={icon}
            iconTintColor={iconTintColor}
            iconPosition="first"
          >
            {I18n.t(getTabItemTitleTranslationKey(routeName))}
          </IconText>
        )
      },
    }),
    tabBarOptions: {
      activeTintColor: $tabNavigationActiveTextColor,
      inactiveTintColor: $tabNavigationInactiveColor,
      style: {
        height: 56,
        backgroundColor: 'white',
      },
      showLabel: false,
      showIcon: true,
    },
  },
)
