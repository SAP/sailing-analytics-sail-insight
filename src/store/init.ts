import AsyncStorage from '@react-native-async-storage/async-storage'
import crashlytics from '@react-native-firebase/crashlytics'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { createMigrate, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import createSagaMiddleware from 'redux-saga'
import ReduxThunk from 'redux-thunk'

import Logger from 'helpers/Logger'
import { serializeDiagnostic } from 'helpers/diagnosticsRedaction'
import Reducers from 'reducers'
import rootSaga from 'sagas'
import { initializePersistor, initializeStore } from 'store'

const initialState = {}

const migrations = {
  0: (state: any) => ({
    ...state,
    events: {},
  }),
}

const persistConfig = {
  key: 'root',
  version: 1,
  debounce: 1000,
  timeout: 10000,
  blacklist: ['network', 'form', 'courses'],
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations)
}

const sagaMiddleware = createSagaMiddleware({
  onError: (error: Error, { sagaStack }) => {
    // Report locally first. Neither a synchronous nor an asynchronous telemetry
    // failure may tear down the saga tree or hide the original diagnostic.
    Logger.error('Unhandled saga error:', error, sagaStack)
    void Promise.resolve().then(async () => {
      await crashlytics().setAttribute('saga', 'true')
      await crashlytics().setAttribute('sagaStack', serializeDiagnostic(sagaStack))
      await crashlytics().recordError(new Error(serializeDiagnostic(error)))
    }).catch(() => undefined)

    // Deliberately not re-thrown: watchers restart themselves in sagas/index.ts.
  }
})

const enhancers = composeWithDevTools(applyMiddleware(
  createNetworkMiddleware({
    actionTypes: ['SET_RACE_TIME', 'SELECT_COURSE', 'FETCH_EVENT_PERMISSION', 'CREATE_EVENT',
      'FETCH_RACES_TIMES_FOR_EVENT', 'FETCH_COURSES_FOR_EVENT', 'ADD_RACE_COLUMNS',
      'REMOVE_RACE_COLUMNS', 'SET_NUMBER_OF_RACES', 'SAVE_COURSE', 'LOAD_MARK_PROPERTIES', 'SET_DISCARDS'],
  }),
  ReduxThunk,
  sagaMiddleware,
))

const persistedReducer = persistReducer(persistConfig, Reducers)

initializeStore(persistedReducer, initialState, enhancers)
initializePersistor()
sagaMiddleware.run(rootSaga)
