import { Platform } from 'react-native'
import React, { Component } from 'react'
import { ReduxNetworkProvider } from 'react-native-offline'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import 'store/init'
import { getPersistor, getStore } from 'store'
import { initStyles, recalculateStyles } from 'styles'
import AppRoot from './AppRoot'
import { enableScreens } from 'react-native-screens'
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
  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReduxNetworkProvider pingInBackground={true} pingInterval={3000}>
            <AppRoot/>
          </ReduxNetworkProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
