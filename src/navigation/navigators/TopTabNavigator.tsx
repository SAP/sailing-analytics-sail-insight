import React from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { createMaterialTopTabNavigator } from 'react-navigation'

import Text from 'components/Text'
import { platformSelect } from 'helpers/environment'
import { getTabItemTitleTranslationKey } from 'helpers/texts'
import I18n from 'i18n'
import {
  $primaryActiveColor,
  $primaryTextColor,
  $secondaryTextColor,
} from 'styles/colors'
import { tab } from 'styles/commons'


const TAB_BAR_PADDING = 20
const TAB_BAR_HEIGHT = 30 + TAB_BAR_PADDING
const INDICATOR_HEIGHT = 3

export default (screenConfig: any, navigatorConfig?: any) => createMaterialTopTabNavigator(
  screenConfig,
  {
    ...(navigatorConfig || {}),
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={[tab.topTabItemText, { color: tintColor }]}
        >
          {I18n.t(getTabItemTitleTranslationKey(navigation.state.routeName)).toUpperCase()}
        </Text>
      ),
    }),
    tabBarOptions: {
      activeTintColor: $primaryTextColor,
      inactiveTintColor: $secondaryTextColor,
      style: {
        backgroundColor: 'white',
      },
      tabStyle: platformSelect(
        {
          paddingTop: TAB_BAR_PADDING,
          height: TAB_BAR_HEIGHT,
        },
        {
          marginTop: getStatusBarHeight(),
          paddingTop: TAB_BAR_PADDING,
          height: TAB_BAR_HEIGHT,
        },
      ),
      indicatorStyle: {
        backgroundColor: $primaryActiveColor,
        height: INDICATOR_HEIGHT,
      },
    },
  },
)
