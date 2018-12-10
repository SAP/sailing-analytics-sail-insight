import React from 'react'
import { View } from 'react-native'
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'

import { initializeApp } from 'actions/appLoading'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingCheckIn } from 'selectors/checkIn'

import { container } from 'styles/commons'

import * as NavigationService from './NavigationService'
import SplashNavigator from './navigators/SplashNavigator'


class InitializationNavigator extends React.Component<{
  initializeApp: () => void,
  isLoggedIn: boolean,
  showLoadingOverlay: boolean,
} > {

  public initializeAppFlow = () => {
    this.props.initializeApp()
  }

  public handleNavigatorRef = (ref: any) => {
    NavigationService.setTopLevelNavigator(ref)
    this.initializeAppFlow()
  }

  public render() {
    const { isLoggedIn, showLoadingOverlay } = this.props
    return (
      <View style={container.main}>
        <SpinnerOverlay
          visible={showLoadingOverlay}
          cancelable={false}
        />
        <SplashNavigator
          screenProps={{ isLoggedIn }}
          ref={this.handleNavigatorRef}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
  showLoadingOverlay: isLoadingCheckIn(state),
})

export default connect(mapStateToProps, { initializeApp })(InitializationNavigator)
