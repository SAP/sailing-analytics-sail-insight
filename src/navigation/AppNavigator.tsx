import React, { Component } from 'react'

import NavigationService from './NavigationService'
import MainNavigator from './navigators/MainNavigator'


class AppNavigator extends Component {
  public render() {
    return (
      <MainNavigator
        ref={(navigatorRef: any) => { NavigationService.setTopLevelNavigator(navigatorRef) }}
      />
    )
  }
}

export default AppNavigator
