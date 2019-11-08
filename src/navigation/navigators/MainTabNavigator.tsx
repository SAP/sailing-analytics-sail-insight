import React from 'react'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import Images from '@assets/Images'
import { getTabItemTitleTranslation } from 'helpers/texts'
import { navigateToFilterSessions, navigateToNewSession, navigateToUserRegistration } from 'navigation'
import * as Screens from 'navigation/Screens'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { getStore } from 'store'

import IconText from 'components/IconText'
import Text from 'components/Text'
import CheckIn from 'containers/session/CheckIn'
import Sessions from 'containers/session/Sessions'
import MarkInventory from 'containers/Inventory/MarkInventory'

import { $primaryActiveColor, $primaryTextColor, $secondaryTextColor } from 'styles/colors'
import { tab } from 'styles/commons'

import HeaderIconButton from 'components/HeaderIconButton'
import AccountNavigator from 'navigation/navigators/AccountNavigator'


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
    
    case Screens.Inventory:
      icon = Images.tabs.sessions
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
      const isLoggedIn = isLoggedInSelector(getStore().getState())
      return isLoggedIn ? navigateToNewSession() : navigateToUserRegistration()
    default:
      return props.defaultHandler(props.navigation)
  }
}

export default createBottomTabNavigator(
  {
    [Screens.Sessions]: createStackNavigator({
      [Screens.UserSessions]: {
        screen: Sessions,
        navigationOptions: ({ navigation }: any) => ({
          headerTitle: (
            <Text style={[tab.topTabItemText, { color: $primaryTextColor }]}>
              {getTabItemTitleTranslation(navigation.state.routeName).toUpperCase()}
            </Text>
          ),
          headerRight: (
            <HeaderIconButton
              icon={Images.actions.share}
              onPress={navigateToFilterSessions}
            />
          ),
        }),
      }
    },
    {
      headerLayoutPreset: 'center',
    }),
    // [Screens.TrackingSetupAction]: TrackingSetup,
    [Screens.Inventory]: MarkInventory.fold,
    [Screens.Account]: AccountNavigator,
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
        backgroundColor: '#123748', // 'white',
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
