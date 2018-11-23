import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component } from 'react'
import { View } from 'react-native'
import { withNetworkConnectivity } from 'react-native-offline'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import 'store/init'

import * as DeepLinking from 'integrations/DeepLinking'

import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates, updateTrackingStatus } from 'actions/locations'
import Logger from 'helpers/Logger'
import InitializationNavigator from 'navigation/InitializationNavigator'
import * as LocationService from 'services/LocationService'
import { getPersistor, getStore } from 'store'

import { initStyles, recalculateStyles } from 'styles'
import { container } from 'styles/commons'


declare var module: any


initStyles()
const store = getStore()
const persistor = getPersistor()

// enable hot module replacement for reducers
if (module.hot) {
  const acceptCallback = () => {
    const rootReducer = require('./reducers').default
    store.replaceReducer(rootReducer)
    recalculateStyles()
  }
  module.hot.accept('reducers', acceptCallback)
  module.hot.acceptCallback = acceptCallback
}

const rootComponent = () => (
  <PersistGate loading={null} persistor={persistor}>
    <View style={container.main}>
      <InitializationNavigator />
    </View>
  </PersistGate>
)

const AppWithNetworkConnectivity = withNetworkConnectivity({
  withRedux: true, // no isConnected as a prop in this case
  checkConnectionInterval: 3000,
  checkInBackground: true,
})(rootComponent)

// must be a component to support hot reloading
class App extends Component {

  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    store.dispatch(initLocationUpdates())
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    this.finalizeDeepLinks()
    LocationService.removeStatusListener(this.handleLocationTrackingStatus)
    LocationService.removeLocationListener(this.handleGeolocation)
  }

  public render() {
    return (
      <Provider store={store}>
        <ActionSheetProvider>
          <AppWithNetworkConnectivity/>
        </ActionSheetProvider>
      </Provider>
    )
  }

  protected initDeepLinks() {
    this.deepLinkSubscriber = DeepLinking.initialize()
  }

  protected finalizeDeepLinks() {
    if (!this.deepLinkSubscriber) {
      return
    }
    this.deepLinkSubscriber()
    this.deepLinkSubscriber = null
  }

  protected handleDeeplink = (params: any) => {
    store.dispatch(performDeepLink(params))
  }

  protected handleLocationTrackingStatus(state: any) {
    const status = state && state.enabled ?
    LocationService.LocationTrackingStatus.RUNNING :
    LocationService.LocationTrackingStatus.STOPPED
    store.dispatch(updateTrackingStatus(status))
  }

  protected async handleGeolocation(location: any) {
    try {
      await store.dispatch(handleLocation(location))
    } catch (err) {
      if (!err) {
        return
      }
      Logger.debug(err.message, err.data)
    }
  }
}

export default App
