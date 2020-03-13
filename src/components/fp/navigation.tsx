import { merge, compose } from 'ramda'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { fromClass, buildComponentWithChildren } from './component'
const Stack = createStackNavigator()
const BottomTabs = createBottomTabNavigator()

export const stackNavigator = buildComponentWithChildren(Stack.Navigator)
export const tabsNavigator = buildComponentWithChildren(BottomTabs.Navigator)

export const stackScreen = compose(
    fromClass(Stack.Screen).contramap,
    merge)

export const tabsScreen = compose(
    fromClass(BottomTabs.Screen).contramap,
    merge)
