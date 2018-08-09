import React, { Component } from 'react'
import { View } from 'react-native'
import { withNetworkConnectivity } from 'react-native-offline'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import * as DeepLinking from 'integrations/DeepLinking'

import { performDeepLink } from 'actions'
import { checkIn } from 'actions/checkIn'
import { updateTrackedLeaderboard, updateTrackingStatus } from 'actions/locations'
import AppNavigator from 'navigation/AppNavigator'
import LocationService, { LocationTrackingStatus } from 'services/LocationService'
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

    // store.dispatch(checkIn('https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'))
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    LocationService.setStartListener(null)
    LocationService.setStopListener(null)
    LocationService.removeLocationListener(this.handleLocation)
  }

  public handleDeeplink = (params: any) => {
    store.dispatch(performDeepLink(params))
  }

  public handleLocationTrackingStart() {
    store.dispatch(updateTrackingStatus(LocationTrackingStatus.RUNNING))
  }

  public handleLocationTrackingStop() {
    store.dispatch(updateTrackingStatus(LocationTrackingStatus.STOPPED))
    store.dispatch(updateTrackedLeaderboard(null))
  }

  public handleLocation(location: any) {
    store.dispatch(handleGPSLocation(location))
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
