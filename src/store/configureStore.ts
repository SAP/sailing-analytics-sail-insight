import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import ReduxThunk from 'redux-thunk'

import Reducers, { NETWORK_REDUCER_NAME } from 'reducers'

const persistConfig = {
  storage,
  key: 'root',
  debounce: 1000,
  blacklist: [NETWORK_REDUCER_NAME],
}

export default (initialState = {}) => {
  const enhancers = composeWithDevTools(applyMiddleware(
    ReduxThunk,
    createNetworkMiddleware(),
  ))

  const persistedReducer = persistReducer(persistConfig, Reducers)

  const store = createStore(persistedReducer, initialState, enhancers)
  return {
    store,
    persistor: persistStore(store),
  }
}
