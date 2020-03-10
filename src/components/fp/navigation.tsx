import { merge, compose } from 'ramda'
import { createStackNavigator } from '@react-navigation/stack'
import { fromClass, buildComponentWithChildren } from './component'
const Stack = createStackNavigator()

export const stackNavigator = buildComponentWithChildren(Stack.Navigator)

export const screen = compose(
    fromClass(Stack.Screen).contramap,
    merge)
