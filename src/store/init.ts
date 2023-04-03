import AsyncStorage from '@react-native-async-storage/async-storage'
import crashlytics from '@react-native-firebase/crashlytics'
import { createNetworkMiddleware } from 'react-native-offline'
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { createMigrate, persistReducer } from 'redux-persist'
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
    crashlytics().setAttribute('saga', 'true')
    crashlytics().setAttribute('sagaStack', sagaStack)
    crashlytics().recordError(error)

    throw error
  }
})

const enhancers = composeWithDevTools(applyMiddleware(
  createNetworkMiddleware({
    actionTypes: ['SET_RACE_TIME', 'SELECT_COURSE', 'FETCH_EVENT_PERMISSION', 'CREATE_EVENT',
      'FETCH_RACES_TIMES_FOR_EVENT', 'FETCH_COURSES_FOR_EVENT', 'ADD_RACE_COLUMNS',
      'REMOVE_RACE_COLUMNS', 'SAVE_COURSE', 'LOAD_MARK_PROPERTIES', 'SET_DISCARDS'],
  }),
  ReduxThunk,
  sagaMiddleware,
))

const persistedReducer = persistReducer(persistConfig, Reducers)

initializeStore(persistedReducer, initialState, enhancers)
initializePersistor()
sagaMiddleware.run(rootSaga)
