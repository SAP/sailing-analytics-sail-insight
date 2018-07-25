import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { PersistGate } from 'redux-persist/integration/react'

import * as DeepLinking from 'integrations/DeepLinking'

import configureStore from 'store/configureStore'
import AppNavigator from 'navigation/AppNavigator'
import { performDeepLink } from 'actions'
import { initStyles, recalculateStyles } from 'styles'
import { container } from 'styles/commons'


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
  componentDidMount() {
    DeepLinking.addListener(this.handleDeeplink)
  }

  componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
  }

  handleDeeplink = (params) => {
    store.dispatch(performDeepLink(params))
  }

  render() {
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
