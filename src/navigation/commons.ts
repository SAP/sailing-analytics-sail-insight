import { StackNavigationOptions } from '@react-navigation/stack'

import { $headerTintColor, $primaryBackgroundColor } from 'styles/colors'
import { navigation as navigationStyles } from 'styles/commons'
import { StackNavigatorConfig } from 'react-navigation'

export const headerNavigationOptions: StackNavigationOptions = {
  headerTitleStyle: navigationStyles.headerTitle,
  headerTintColor: $headerTintColor,
  headerStyle: {
    backgroundColor: $primaryBackgroundColor,
  },
  headerTitleAlign: 'center',
}

export const stackNavigatorConfig: StackNavigatorConfig = {
  mode: 'card',
  headerMode: 'screen',
}

export const navHeaderTransparentProps = {
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
}
