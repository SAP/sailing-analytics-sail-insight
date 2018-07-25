import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'

import Welcome from 'containers/Welcome'
import QRScanner from 'containers/QRScanner'

import * as Screens from './Screens'
import NavigationService from './NavigationService'


const MainNavigator = createStackNavigator(
  {
    [Screens.Welcome]: { screen: Welcome, navigationOptions: { header: null } },
    [Screens.QRScanner]: { screen: QRScanner },
  },
  {
    initialRouteName: 'Welcome',
    mode: 'modal',
    headerMode: 'screen',
  },
)


class AppNavigator extends Component {
  render() {
    return (
      <MainNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    )
  }
}

export default AppNavigator
