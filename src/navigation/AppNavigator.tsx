import React, { Component } from 'react'

import * as NavigationService from './NavigationService'
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
