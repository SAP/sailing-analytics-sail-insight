import React, { Component } from 'react'
import { View } from 'react-native'
import { withNetworkConnectivity } from 'react-native-offline'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import * as DeepLinking from 'integrations/DeepLinking'

import { performDeepLink } from 'actions'
import { handleLocation, removeTrackedRegatta, updateTrackingStatus } from 'actions/locations'
import AppNavigator from 'navigation/AppNavigator'
import * as LocationService from 'services/LocationService'
import configureStore from 'store/configureStore'
import { initStyles, recalculateStyles } from 'styles'
import { container } from 'styles/commons'

declare var module: any

initStyles()

const { store, persistor } = configureStore()

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
      <AppNavigator />
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
  public componentDidMount() {
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.setStartListener(this.handleLocationTrackingStart)
    LocationService.setStopListener(this.handleLocationTrackingStop)
    LocationService.addLocationListener(this.handleLocation)
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    LocationService.removeStartListener()
    LocationService.removeStopListener()
    LocationService.removeLocationListener(this.handleLocation)
  }

  public handleDeeplink = (params: any) => {
    store.dispatch(performDeepLink(params))
  }

  public handleLocationTrackingStart() {
    store.dispatch(updateTrackingStatus(LocationService.LocationTrackingStatus.RUNNING))
  }

  public handleLocationTrackingStop() {
    store.dispatch(updateTrackingStatus(LocationService.LocationTrackingStatus.STOPPED))
    store.dispatch(removeTrackedRegatta())
  }

  public handleLocation(location: any) {
    store.dispatch(handleLocation(location))
  }

  public render() {
    return (
      <Provider store={store}>
        <AppWithNetworkConnectivity/>
      </Provider>
    )
  }
}

export default App
