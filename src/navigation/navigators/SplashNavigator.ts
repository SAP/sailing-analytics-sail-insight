import { createSwitchNavigator } from 'react-navigation'

import * as Screens from 'navigation/Screens'

import SplashScreen from 'containers/SplashScreen'
import AppNavigator from './AppNavigator'


export default createSwitchNavigator(
  {
    [Screens.Splash]: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.App]: AppNavigator,
  },
  {
    initialRouteName: Screens.Splash,
  },
)
