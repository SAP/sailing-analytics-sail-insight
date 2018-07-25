import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StatusBar, View } from 'react-native'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import EStyleSheet from 'react-native-extended-stylesheet'

import * as DeepLinking from 'integrations/DeepLinking'

import Reducers from 'reducers'
import AppNavigator from 'navigation/AppNavigator'
import * as colors from 'styles/colors'
import * as dimensions from 'styles/dimensions'
import { performDeepLink } from 'actions'


StatusBar.setBarStyle('dark-content')
StatusBar.setBackgroundColor(colors.$containerBackgroundColor)

EStyleSheet.build({
  ...colors,
  ...dimensions,
})

const enhancers = composeWithDevTools(applyMiddleware(
  ReduxThunk,
))

const store = createStore(Reducers, {}, enhancers)

// enable hot module replacement for reducers
if (module.hot) {
  const acceptCallback = () => {
    const rootReducer = require('./reducers/index.js').default
    store.replaceReducer(rootReducer)
    EStyleSheet.clearCache()
    EStyleSheet.build() // recalculate styles
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
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </Provider>
    )
  }
}

export default App
