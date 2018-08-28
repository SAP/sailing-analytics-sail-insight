import React, { Component } from 'react'

import * as NavigationService from './NavigationService'
import MainNavigator from './navigators/MainNavigator'


class AppNavigator extends Component {

  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
  }

  public render() {
    return (
      <MainNavigator
        ref={this.handleNavigatorRef}
      />
    )
  }
}

export default AppNavigator
