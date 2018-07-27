import React, { Component } from 'react'

import NavigationService from './NavigationService'
import MainNavigator from './navigators/MainNavigator'


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
