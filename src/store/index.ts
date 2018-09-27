import { AsyncStorage } from 'react-native'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistReducer, persistStore } from 'redux-persist'
import ReduxThunk from 'redux-thunk'

import Reducers from 'reducers'
import { FORM_REDUCER_NAME, NETWORK_REDUCER_NAME } from 'reducers/config'


const initialState = {}
const persistConfig = {
  key: 'root',
  debounce: 1000,
  blacklist: [NETWORK_REDUCER_NAME, FORM_REDUCER_NAME],
  storage: AsyncStorage,
}

const enhancers = composeWithDevTools(applyMiddleware(
  createNetworkMiddleware(),
  ReduxThunk,
))

const persistedReducer = persistReducer(persistConfig, Reducers)
const store = createStore(persistedReducer, initialState, enhancers)

export default {
  store,
  persistor: persistStore(store),
}
