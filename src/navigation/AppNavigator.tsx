import React from 'react'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/app'
import * as NavigationService from './NavigationService'
import MainNavigator from './navigators/MainNavigator'


class AppNavigator extends React.Component<{
  initializeApp: () => void,
} > {

  public initializeAppFlow = () => {
    this.props.initializeApp()
  }

  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
    this.initializeAppFlow()
  }

  public render() {
    return (
      <MainNavigator
        ref={this.handleNavigatorRef}
      />
    )
  }
}

export default connect(null, { initializeApp })(AppNavigator)
