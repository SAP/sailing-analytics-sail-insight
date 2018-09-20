import React from 'react'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/appLoading'

import * as NavigationService from './NavigationService'
import AppNavigator from './navigators/AppNavigator'


class InitializationNavigator extends React.Component<{
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
    return <AppNavigator ref={this.handleNavigatorRef}/>
  }
}

export default connect(null, { initializeApp })(InitializationNavigator)
