import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component as ReactComponent } from 'react'
import { connect } from 'react-redux'

import 'store/init'

import SplashScreen from 'containers/SplashScreen'
import * as Screens from 'navigation/Screens'
import Logger from 'helpers/Logger'
import * as DeepLinking from 'integrations/DeepLinking'
import * as LocationService from 'services/LocationService'
import { initializeApp } from 'actions/appLoading'
import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates } from 'actions/locations'
import { updateTrackingStatus } from 'actions/locationTrackingData'
import * as GpsFixService from './services/GPSFixService'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingSplash } from 'selectors/checkIn'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from 'navigation/NavigationContext'
import { screen, stackNavigator } from 'components/fp/navigation'
import { Component, fold, nothing } from 'components/fp/component'
import { compose, reduce, concat } from 'ramda'
import MainNavigator from 'navigation/navigators/MainNavigator'
import FirstContact from 'containers/user/FirstContact'

interface Props {
  initializeApp: () => void,
  performDeepLink: any
  updateTrackingStatus: any
  handleLocation: any
  initLocationUpdates: any
  isLoggedIn: any
  showSplash: any
}

const withoutHeader = {options: { headerShown: false }}

const getInitialRouteName = props =>
  props.isLoadingSplash ? Screens.Splash :
  props.isLoggedIn ? Screens.Main :
  Screens.FirstContact

const AppNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: getInitialRouteName(props) }),
  reduce(concat, nothing()))([
  screen({ name: Screens.Splash, component: SplashScreen, ...withoutHeader }),
  screen({ name: Screens.FirstContact, component: FirstContact, ...withoutHeader }),
  screen({ name: Screens.Main, component: MainNavigator, ...withoutHeader })
]))

class AppRoot extends ReactComponent<Props> {
  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    LocationService.registerEvents()
    this.props.initLocationUpdates()
    this.props.initializeApp()
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    this.finalizeDeepLinks()
    LocationService.removeStatusListener(this.handleLocationTrackingStatus)
    LocationService.removeLocationListener(this.handleGeolocation)
    LocationService.unregisterEvents()
    GpsFixService.stopGPSFixUpdates()
  }

  public render() {
    const { isLoggedIn, showSplash } = this.props
    return (
      <ActionSheetProvider>
        <AuthContext.Provider value = {{isLoading: showSplash, isLoggedIn}}>
          <NavigationContainer>
            { AppNavigator.fold(this.props) }
          </NavigationContainer>
        </AuthContext.Provider>
      </ActionSheetProvider>
    )
  }

  protected initDeepLinks = () => {
    this.deepLinkSubscriber = DeepLinking.initialize()
  }

  protected finalizeDeepLinks = () => {
    if (!this.deepLinkSubscriber) {
      return
    }
    this.deepLinkSubscriber()
    this.deepLinkSubscriber = null
  }

  protected handleDeeplink = (params: any) => {
    this.props.performDeepLink(params)
  }

  protected handleLocationTrackingStatus = (enabled: boolean) => {
    const status = enabled ?
    LocationService.LocationTrackingStatus.RUNNING :
    LocationService.LocationTrackingStatus.STOPPED
    this.props.updateTrackingStatus(status)
  }

  protected handleGeolocation = async (location: any) => {
    try {
      await this.props.handleLocation(location)
    } catch (err) {
      if (!err) {
        return
      }
      Logger.debug(err.message, err.data)
    }
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
  isLoadingSplash: isLoadingSplash(state),
})

export default connect(mapStateToProps, {
  performDeepLink,
  updateTrackingStatus,
  handleLocation,
  initLocationUpdates,
  initializeApp
})(AppRoot)
