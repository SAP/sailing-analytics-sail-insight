import React from 'react'
import { View } from 'react-native'
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/appLoading'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingCheckIn, isLoadingSplash } from 'selectors/checkIn'

import { container } from 'styles/commons'

import * as NavigationService from './NavigationService'
import SplashNavigator from './navigators/SplashNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from './NavigationContext'

class InitializationNavigator extends React.Component<{
  initializeApp: () => void,
  isLoggedIn: boolean,
  showSplash: boolean,
  showLoadingOverlay: boolean,
} > {

  public initializeAppFlow = () => this.props.initializeApp()


  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
    this.initializeAppFlow()
  }

  public render() {
    const { isLoggedIn, showLoadingOverlay, showSplash } = this.props
    return (
      <View style={container.main}>
        <SpinnerOverlay
          visible={showLoadingOverlay}
          cancelable={false}
        />
        <AuthContext.Provider value = {{isLoading: showSplash, isLoggedIn}}>
          <NavigationContainer ref={this.handleNavigatorRef}>
            <SplashNavigator
            />
          </NavigationContainer>
        </AuthContext.Provider>
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
  showLoadingOverlay: isLoadingCheckIn(state),
  showSplash: isLoadingSplash(state),
})

export default connect(mapStateToProps, { initializeApp })(InitializationNavigator)
