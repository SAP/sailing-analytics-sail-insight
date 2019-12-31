import React, { Component } from 'react'
import { NetworkProvider } from 'react-native-offline'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import 'store/init'

import { getPersistor, getStore } from 'store'

import { initStyles, recalculateStyles } from 'styles'

import AppRoot from './AppRoot'


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

// must be a component to support hot reloading
class App extends Component {
  public render() {
    return (
      <NetworkProvider pingInBackground={true} pingInterval={3000} pingServerUrl="https://www.google233244.com/">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRoot/>
        </PersistGate>
      </Provider>
      </NetworkProvider>
    )
  }
}

export default App
