import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'

import Images from '@assets/Images'
import { getTabItemTitleTranslation } from 'helpers/texts'
import * as Screens from 'navigation/Screens'

import IconText from 'components/IconText'
import MarkInventory from 'containers/Inventory/MarkInventory'
import Sessions from 'containers/session/Sessions'

import { $primaryTextColor, $secondaryTextColor } from 'styles/colors'
import { tab } from 'styles/commons'

import TrackingList from 'containers/tracking/TrackingList'
import AccountNavigator from 'navigation/navigators/AccountNavigator'


const getTabBarIcon = (navigation: any) => ({ focused, tintColor }: any) => {
  const { routeName = '' } = navigation.state
  let icon
  switch (routeName) {
    case Screens.TrackingList:
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
      icon = Images.tabs.inventory
      break
  }

  const iconTintColor = focused ? 'white' : 'gray'
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
  return props.defaultHandler(props.navigation)
}

export default createBottomTabNavigator(
  {
    [Screens.TrackingList]: TrackingList,
    [Screens.Sessions]: Sessions,
    [Screens.Inventory]: MarkInventory.fold,
    [Screens.Account]: AccountNavigator,
  },
  {
    initialRouteName: Screens.TrackingList,
    backBehavior: 'none',
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: $primaryTextColor,
      inactiveTintColor: $secondaryTextColor,
      style: {
        height: 56,
        backgroundColor: '#123748',
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
