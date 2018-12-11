import { NavigationParams, StackNavigatorConfig } from 'react-navigation'

import { $headerTintColor, $primaryBackgroundColor } from 'styles/colors'
import { navigation as navigationStyles } from 'styles/commons'


export const headerNavigationOptions: NavigationParams = {
  headerTitleStyle: navigationStyles.headerTitle,
  headerTintColor: $headerTintColor,
  headerStyle: {
    backgroundColor: $primaryBackgroundColor,
  },
}

export const stackNavigatorConfig: StackNavigatorConfig = {
  mode: 'card',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
}

export const navHeaderTransparentProps = {
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
}
