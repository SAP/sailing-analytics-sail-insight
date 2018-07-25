import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'

import Welcome from 'containers/Welcome'
import NavigationService from './NavigationService'


const MainNavigator = createStackNavigator(
  {
    Welcome: { screen: Welcome, navigationOptions: { header: null } },
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
