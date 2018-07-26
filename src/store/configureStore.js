import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import storage from 'redux-persist/lib/storage'

import Reducers from 'reducers'

const persistConfig = {
  key: 'root',
  storage,
  debounce: 1000,
}

export default (initialState = {}) => {
  const enhancers = composeWithDevTools(applyMiddleware(
    ReduxThunk,
  ))

  const persistedReducer = persistReducer(persistConfig, Reducers)

  const store = createStore(persistedReducer, initialState, enhancers)
  return {
    store,
    persistor: persistStore(store),
  }
}
