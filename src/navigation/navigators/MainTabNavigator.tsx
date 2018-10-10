import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'

import Images from '@assets/Images'
import { getTabItemTitleTranslation } from 'helpers/texts'
import { navigateToNewSession, navigateToUserRegistration } from 'navigation'
import * as Screens from 'navigation/Screens'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { generateNewSession } from 'services/SessionService'
import reduxStore from 'store'

import IconText from 'components/IconText'
import AppSettings from 'containers/AppSettings'
import RegisterPrompt from 'containers/authentication/RegisterPrompt'
import CheckIn from 'containers/session/CheckIn'
import Sessions from 'containers/session/Sessions'
import TrackingSetup from 'containers/tracking/TrackingSetup'
import Tracks from 'containers/tracking/Tracks'
import UserBoats from 'containers/user/UserBoats'
import UserProfile from 'containers/user/UserProfile'

import { $primaryActiveColor, $primaryTextColor, $secondaryTextColor } from 'styles/colors'
import { tab } from 'styles/commons'

import AuthNavigatorWrapper from './AuthNavigatorWrapper'
import TopTabNavigator from './TopTabNavigator'


const getTabBarIcon = (navigation: any) => ({ focused, tintColor }: any) => {
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
  const focusStyle = focused ? { fontWeight: 'bold' } : undefined

  return (
    <IconText
      iconStyle={[tab.tabItemIcon, { tintColor: iconTintColor }]}
      textStyle={[tab.bottomTabItemText, { color: tintColor }, focusStyle]}
      source={icon}
      iconTintColor={iconTintColor}
      iconPosition="first"
    >
      {getTabItemTitleTranslation(routeName)}
    </IconText>
  )
}

const onTabBarPress = (navigation: any) => (props: any = {}) => {
  if (!props.defaultHandler || !props.navigation) {
    return
  }
  if (!props.navigation.state) {
    return props.defaultHandler(navigation)
  }
  switch (navigation.state.routeName) {
    case Screens.TrackingSetupAction:
      const isLoggedIn = isLoggedInSelector(reduxStore.store.getState())
      return isLoggedIn ? navigateToNewSession() : navigateToUserRegistration()
    default:
      return props.defaultHandler(props.navigation)
  }
}

const getUserAccountNavigator = (isLoggedIn: boolean) => {
  return TopTabNavigator(
    isLoggedIn ?
    {
      [Screens.UserProfile]: UserProfile,
      [Screens.UserBoats]: UserBoats,
      [Screens.AppSettings]: AppSettings,
    } :
    {
      [Screens.UserProfile]: RegisterPrompt,
      [Screens.AppSettings]: AppSettings,
    },
    { initialRouteName: Screens.UserProfile },
  )
}


export default createBottomTabNavigator(
  {
    [Screens.Sessions]: TopTabNavigator(
      {
        [Screens.UserSessions]: Sessions,
        [Screens.Tracks]: Tracks,
      },
      { initialRouteName: Screens.UserSessions },
    ),
    [Screens.TrackingSetupAction]: TrackingSetup,
    [Screens.CheckIn]: CheckIn,
    [Screens.Account]: AuthNavigatorWrapper(getUserAccountNavigator),
  },
  {
    initialRouteName: Screens.Sessions,
    backBehavior: 'none',
    swipeEnabled: false,
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
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: getTabBarIcon(navigation),
      tabBarOnPress:  onTabBarPress(navigation),
    }),
  },
)
