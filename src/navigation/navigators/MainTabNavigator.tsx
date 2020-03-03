import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
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
import { navigateBack, getRootState } from 'navigation/NavigationService'
import { Platform } from 'react-native'

import AccountNavigator from 'navigation/navigators/AccountNavigator'
import TrackingNavigator from 'navigation/navigators/TrackingNavigator'
import { SessionsContext } from 'navigation/NavigationContext'

const getTabBarIcon = (route: any, tintColor: any, focused: any) => {
  const { name = '' } = route
  let icon
  switch (name) {
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
      iconOnly={false}
    >
      {getTabItemTitleTranslation(name)}
    </IconText>
  )
}

const onTabBarPress = (props: any = {}) => {
  const { preventDefault } = props
  const navigationTracking = getRootState('TrackingNavigator')
  const navigationTabs = getRootState('MainTabs')

  if (!navigationTracking || !navigationTabs || !preventDefault ) {
    return
  }

  if (!navigationTracking.state || !navigationTabs.state) {
    return
  }
  // Prevent exit tracking screen when track navigator is selected and user taps on
  // the tracking tab in main navigator
  if (navigationTracking.name === 'TrackingNavigator' &&
      navigationTabs.state.index === 0 && //focused
      navigationTracking.state.index === 1) {
    preventDefault()
  }
}

const Stack = createStackNavigator()

function SessionsStack() 
{
  return (
    <SessionsContext.Provider value ={{forTracking: false}}>
      <Stack.Navigator
        initialRouteName = {Screens.Sessions}
        {...commons.stackNavigatorConfig}
        screenOptions = {{...commons.headerNavigationOptions}}  
      >
        <Stack.Screen
          name = {Screens.Sessions}
          component = {Sessions}
          options = {{headerShown: false}}
        />
        <Stack.Screen
          name = {Screens.SessionDetail}
          component = {SessionDetail.fold}
          options = {() => ({
            title: I18n.t('title_event_details'),
            headerLeft: () => (
              <HeaderBackButton
                tintColor="white"
                labelVisible={false}
                onPress={navigateBack}
              />
            ),
            headerRight: () => ShareButton.fold({}),
          })}
        />
        <Stack.Screen
          name = {Screens.EventCreation}
          component = {EventCreation.fold}
          options = {() => ({
            title: I18n.t('title_event_creation'),
            headerLeft: () => (
              <HeaderBackButton
                tintColor="white"
                labelVisible={false}
                onPress={navigateBack}
              />
            ),
          })}
        />
        <Stack.Screen
          name = {Screens.SessionDetail4Organizer}
          component = {SessionDetail4Organizer.fold}
          options = {() => ({
            title: I18n.t('title_event_details'),
            headerLeft: () => (
              <HeaderBackButton
                tintColor="white"
                labelVisible={false}
                onPress={navigateBack}
              />
            ),
            headerRight: () => ShareButton.fold({}),
          })}
        />
        <Stack.Screen
          name = {Screens.RaceDetails}
          component = {RaceDetails.fold}
          options = {() => ({
            title: I18n.t('title_race_details'),
            headerLeft: () => (
              <HeaderBackButton
                tintColor="white"
                labelVisible={false}
                onPress={navigateBack}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </SessionsContext.Provider>
  )
}

const Tabs = createBottomTabNavigator()

export default function MainTabNavigator()
{
  return (
    <Tabs.Navigator
      initialRouteName = {Screens.TrackingNavigator}
      backBehavior = 'initialRoute'
      tabBarOptions = {{
        activeTintColor: $primaryTextColor,
        inactiveTintColor: $secondaryTextColor,
        style: {
          height: 56,
          backgroundColor: '#123748',
        },
        showLabel: false,
        showIcon: true,
        keyboardHidesTabBar: (Platform.OS === 'android') ? true : false,
      }}
      screenOptions = {({ route }) => ({
        tabBarIcon: ({ color, focused}) => getTabBarIcon(route, color, focused),
      })}
    >
      <Tabs.Screen 
        name = {Screens.TrackingNavigator}
        component = {TrackingNavigator}
        listeners = {{
          tabPress: onTabBarPress,
        }}
      />
      <Tabs.Screen
        name = {Screens.Sessions}
        component = {SessionsStack}
      />
      <Tabs.Screen
        name = {Screens.Inventory}
        component = {MarkInventory.fold}
      />
      <Tabs.Screen
        name = {Screens.Account}
        component = {AccountNavigator}
      />
    </Tabs.Navigator>
  )
}
