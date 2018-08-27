import React from 'react'
import { Text } from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation'

import { getTabItemTitleTranslationKey } from 'helpers/texts'
import I18n from 'i18n'
import * as Screens from 'navigation/Screens'
import { $tabNavigationActiveIconColor, $tabNavigationActiveTextColor, $tabNavigationInactiveColor } from 'styles/colors'
import tabs from 'styles/commons/tabs'


const TAB_BAR_HEIGHT = 52
const INDICATOR_HEIGHT = 3

export default (screenConfig: any, navigatorConfig: any = {}) => createMaterialTopTabNavigator(
  screenConfig,
  {
    ...navigatorConfig,
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={[tabs.topTabItemText, { color: tintColor }]}
        >
          {I18n.t(getTabItemTitleTranslationKey(navigation.state.routeName)).toUpperCase()}
        </Text>
      ),
    }),
    tabBarOptions: {
      activeTintColor: $tabNavigationActiveTextColor,
      inactiveTintColor: $tabNavigationInactiveColor,
      style: {
        backgroundColor: 'white',
        // height: TAB_BAR_HEIGHT,
      },
      tabStyle: {
        height: TAB_BAR_HEIGHT - INDICATOR_HEIGHT,
      },
      indicatorStyle: {
        backgroundColor: $tabNavigationActiveIconColor,
        height: INDICATOR_HEIGHT,
      },
    },
  },
)
