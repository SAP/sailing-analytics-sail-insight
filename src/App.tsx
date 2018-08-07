import React, { Component } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import * as DeepLinking from 'integrations/DeepLinking'

import { performDeepLink } from 'actions'
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
    const rootReducer = require('./reducers/index.js').default
    store.replaceReducer(rootReducer)
    recalculateStyles()
  }
  module.hot.accept('reducers', acceptCallback)
  module.hot.acceptCallback = acceptCallback
}

// must be a component to support hot reloading
class App extends Component {
  public componentDidMount() {
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.setStartListener(this.handleLocationTrackingStart)
    LocationService.setStopListener(this.handleLocationTrackingStop)
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    LocationService.setStartListener(null)
    LocationService.setStopListener(null)
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

  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={container.main}>
            <AppNavigator />
          </View>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
