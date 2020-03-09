import React from 'react'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/appLoading'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingSplash } from 'selectors/checkIn'

import * as NavigationService from './NavigationService'
import SplashNavigator from './navigators/SplashNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from './NavigationContext'

class InitializationNavigator extends React.Component<{
  initializeApp: () => void,
  isLoggedIn: boolean,
  showSplash: boolean,
} > {

  public initializeAppFlow = () => this.props.initializeApp()


  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
    this.initializeAppFlow()
  }

  public render() {
    const { isLoggedIn, showSplash } = this.props
    return (
      <AuthContext.Provider value = {{isLoading: showSplash, isLoggedIn}}>
        <NavigationContainer ref={this.handleNavigatorRef}>
          <SplashNavigator
          />
        </NavigationContainer>
      </AuthContext.Provider>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
  showSplash: isLoadingSplash(state),
})

export default connect(mapStateToProps, { initializeApp })(InitializationNavigator)
