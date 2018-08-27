import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'

import IconText from 'components/IconText'
import Account from 'containers/Account'
import CheckIn from 'containers/CheckIn'
import Sessions from 'containers/Sessions'
import TrackingSetup from 'containers/TrackingSetup'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as Screens from 'navigation/Screens'
import { $tabNavigationActiveIconColor, $tabNavigationActiveTextColor, $tabNavigationInactiveColor } from 'styles/colors'
import tabs from 'styles/commons/tabs'


export default createBottomTabNavigator(
  {
    [Screens.TrackingSetup]: TrackingSetup,
    [Screens.Sessions]: Sessions,
    [Screens.CheckIn]: CheckIn,
    [Screens.Account]: Account,
  },
  {
    initialRouteName: Screens.Sessions,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName = '' } = navigation.state
        let icon
        switch (routeName) {
          case Screens.TrackingSetup:
            icon = Images.actionables.add
            break
        }

        const iconTintColor = focused ? $tabNavigationActiveIconColor : tintColor

        return (
          <IconText
            iconStyle={[tabs.tabItemIcon, { tintColor: iconTintColor }]}
            textStyle={[tabs.tabItemText, { color: tintColor }]}
            source={icon}
            iconTintColor={iconTintColor}
            iconPosition="first"
          >
            {I18n.t(`caption_tab_${routeName.toLowerCase()}`)}
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
