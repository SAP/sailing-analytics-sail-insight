import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'store/init'

import Logger from 'helpers/Logger'
import * as DeepLinking from 'integrations/DeepLinking'
import InitializationNavigator from 'navigation/InitializationNavigator'
import * as LocationService from 'services/LocationService'

import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates } from 'actions/locations'
import { updateTrackingStatus } from 'actions/locationTrackingData'
import * as GpsFixService from './services/GPSFixService'


interface Props {
  performDeepLink: any
  updateTrackingStatus: any
  handleLocation: any
  initLocationUpdates: any
}

class AppRoot extends Component<Props> {
  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    LocationService.registerEvents()
    this.props.initLocationUpdates()
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
    return (
      <ActionSheetProvider>
        <InitializationNavigator />
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

export default connect(null, {
  performDeepLink,
  updateTrackingStatus,
  handleLocation,
  initLocationUpdates,
})(AppRoot)
