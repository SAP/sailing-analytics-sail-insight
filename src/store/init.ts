import { AsyncStorage } from 'react-native'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistReducer } from 'redux-persist'
import ReduxThunk from 'redux-thunk'

import Reducers from 'reducers'
import { FORM_REDUCER_NAME, NETWORK_REDUCER_NAME } from 'reducers/config'
import { initializePersistor, initializeStore } from 'store'


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

initializeStore(persistedReducer, initialState, enhancers)
initializePersistor()
