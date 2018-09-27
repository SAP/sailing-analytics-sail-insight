import React from 'react'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/appLoading'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'

import * as NavigationService from './NavigationService'
import SplashNavigator from './navigators/SplashNavigator'


class InitializationNavigator extends React.Component<{
  initializeApp: () => void,
  isLoggedIn: boolean,
} > {

  public initializeAppFlow = () => {
    this.props.initializeApp()
  }

  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
    this.initializeAppFlow()
  }

  public render() {
    const { isLoggedIn } = this.props
    return (
      <SplashNavigator
        screenProps={{ isLoggedIn }}
        ref={this.handleNavigatorRef}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps, { initializeApp })(InitializationNavigator)
