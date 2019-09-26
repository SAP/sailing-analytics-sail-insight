import { AsyncStorage } from 'react-native'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistReducer, createMigrate } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import createSagaMiddleware from 'redux-saga'
import ReduxThunk from 'redux-thunk'

import Reducers from 'reducers'
import rootSaga from 'sagas'
import { initializePersistor, initializeStore } from 'store'

const initialState = {}

const migrations = {
  0: (state: any) => ({
    ...state,
    events: {}
  })
}

const persistConfig = {
  key: 'root',
  version: 1,
  debounce: 1000,
  timeout: 10000,
  blacklist: ['network', 'form'],
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: true })
}

const sagaMiddleware = createSagaMiddleware()
const enhancers = composeWithDevTools(applyMiddleware(
  createNetworkMiddleware(),
  ReduxThunk,
  sagaMiddleware,
))

const persistedReducer = persistReducer(persistConfig, Reducers)

initializeStore(persistedReducer, initialState, enhancers)
initializePersistor()
sagaMiddleware.run(rootSaga)
