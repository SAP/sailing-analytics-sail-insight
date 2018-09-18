import { AsyncStorage } from 'react-native'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistReducer, persistStore } from 'redux-persist'
import ReduxThunk from 'redux-thunk'

import Reducers from 'reducers'
import { NETWORK_REDUCER_NAME } from 'reducers/config'


const persistConfig = {
  key: 'root',
  debounce: 1000,
  blacklist: [NETWORK_REDUCER_NAME],
  storage: AsyncStorage,
}

export default (initialState = {}) => {
  const enhancers = composeWithDevTools(applyMiddleware(
    createNetworkMiddleware(),
    ReduxThunk,
  ))

  const persistedReducer = persistReducer(persistConfig, Reducers)
  const store = createStore(persistedReducer, initialState, enhancers)

  return {
    store,
    persistor: persistStore(store),
  }
}
