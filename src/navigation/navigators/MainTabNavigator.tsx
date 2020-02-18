import React from 'react'
import { createBottomTabNavigator, createStackNavigator, HeaderBackButton } from 'react-navigation'
import I18n from 'i18n'

import Images from '@assets/Images'
import { getTabItemTitleTranslation } from 'helpers/texts'
import * as Screens from 'navigation/Screens'
import * as commons from 'navigation/commons'
import IconText from 'components/IconText'
import MarkInventory from 'containers/Inventory/MarkInventory'
import Sessions from 'containers/session/Sessions'
import RaceDetails from 'containers/CourseCreation/RaceDetails'
import SessionDetail, { ShareButton } from 'containers/session/SessionDetail'
import SessionDetail4Organizer from 'containers/session/SessionDetail4Organizer'
import EventCreation from 'containers/session/EventCreation'
import { $primaryTextColor, $secondaryTextColor } from 'styles/colors'
import { tab } from 'styles/commons'
import { navigateBack } from 'navigation/NavigationService'
import { Platform } from 'react-native'

import AccountNavigator from 'navigation/navigators/AccountNavigator'
import TrackingNavigator from 'navigation/navigators/TrackingNavigator'

const getTabBarIcon = (navigation: any) => ({ focused, tintColor }: any) => {
  const { routeName = '' } = navigation.state
  let icon
  switch (routeName) {
    case Screens.TrackingNavigator:
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

const onTabBarPress = (props: any = {}) => {
  const { defaultHandler, navigation } = props

  if (!defaultHandler || !navigation) {
    return
  }
  if (!navigation.state) {
    return defaultHandler(navigation)
  }
  // Prevent exit tracking screen when track navigator is selected and user taps on
  // the tracking tab in main navigator
  if (navigation.state.key === 'TrackingNavigator' &&
      navigation.isFocused() &&
      navigation.state.index === 1) {
    return
  }
  return defaultHandler(navigation)
}

const sessionsStack = createStackNavigator({
  [Screens.Sessions]: {
    screen: Sessions,
    navigationOptions: {
      header: null
    }
  },
  [Screens.SessionDetail]: {
    screen: SessionDetail.fold,
    navigationOptions: {
      title: I18n.t('title_event_details'),
      headerLeft: () => (
        <HeaderBackButton
          tintColor="white"
          title=""
          onPress={navigateBack}
        />
      ),
      headerRight: ShareButton.fold({}),
    },
  },
  [Screens.EventCreation]: {
    screen: EventCreation.fold,
    navigationOptions: {
      title: I18n.t('title_event_creation'),
      headerLeft: () => (
        <HeaderBackButton
          tintColor="white"
          title=""
          onPress={navigateBack}
        />
      ),
    },
  },
  [Screens.SessionDetail4Organizer]: {
    screen: SessionDetail4Organizer.fold,
    navigationOptions: {
      title: I18n.t('title_event_details'),
      headerLeft: () => (
        <HeaderBackButton
          tintColor="white"
          title=""
          onPress={navigateBack}
        />
      ),
      headerRight: ShareButton.fold({}),
    },
  },
  [Screens.RaceDetails]: {
    screen: RaceDetails.fold,
    navigationOptions: {
      title: I18n.t('title_race_details'),
      headerLeft: () => (
        <HeaderBackButton
          tintColor="white"
          title=""
          onPress={navigateBack}
        />
      ),
    },
  },
},
{
  initialRouteName: Screens.Sessions,
  ...commons.stackNavigatorConfig,
  defaultNavigationOptions: () => commons.headerNavigationOptions,
})

const sessionGetStateForAction = sessionsStack.router.getStateForAction

sessionsStack.router.getStateForAction = (action, state) => {
  if (state && action.type === 'replaceCurrentScreen') {
    const routes = state.routes.slice(0, state.routes.length - 1)
    routes.push(action)
    return {
      ...state,
      routes,
      index: routes.length - 1
    }
  }
  return sessionGetStateForAction(action, state)
}

export default createBottomTabNavigator(
  {
    [Screens.TrackingNavigator]: TrackingNavigator,
    [Screens.Sessions]: sessionsStack,
    [Screens.Inventory]: MarkInventory.fold,
    [Screens.Account]: AccountNavigator,
  },
  {
    initialRouteName: Screens.TrackingNavigator,
    backBehavior: 'initialRoute',
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
      keyboardHidesTabBar: (Platform.OS === 'android') ? true : false,
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: getTabBarIcon(navigation),
      tabBarOnPress: onTabBarPress,
    }),
  },
)
