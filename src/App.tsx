import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo'
import React, { Component } from 'react'
import { offlineActionCreators } from 'react-native-offline'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PersistGate } from 'redux-persist/integration/react'
import 'store/init'
import { getPersistor, getStore } from 'store'
import { initStyles, recalculateStyles } from 'styles'
import WaveActivityIndicatorFullscreen from 'components/WaveActivityIndicatorFullscreen'
import AppRoot from './AppRoot'
import 'react-native-get-random-values';

declare var module: any

initStyles()
const store = getStore()
const persistor = getPersistor()

// @todo the following line is probably not required anymore as per BC break of the lib; double check this
// Platform.OS === 'ios' && enableScreens()

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

// must be a component to support hot reloading
class App extends Component {
  private unsubscribeNetInfo?: NetInfoSubscription

  public componentDidMount() {
    // NetInfo is the connectivity source for the app. react-native-offline is
    // retained only for its Redux reducer/middleware and offline action queue.
    this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange)
    NetInfo.fetch().then(this.handleNetworkChange)
  }

  public componentWillUnmount() {
    this.unsubscribeNetInfo?.()
  }

  private handleNetworkChange = (state: NetInfoState) => {
    const isConnected = Boolean(state.isConnected && state.isInternetReachable)
    store.dispatch(offlineActionCreators.connectionChange(isConnected))
  }

  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<WaveActivityIndicatorFullscreen/>} persistor={persistor}>
          <SafeAreaProvider>
            <AppRoot/>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default App

