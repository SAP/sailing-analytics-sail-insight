import { createStore } from 'redux'
import { persistStore } from 'redux-persist'

/**
 * Ensure that this file does not have any other dependencies
 * to prevent circular dependencies.
 */

let store: any
let persistor: any

export const initializeStore = (reducer: any, ...options: any[]) => {
  if (store) {
    throw new Error('The stores has already been initialized.')
  }
  store = createStore(reducer, ...options)
  return store
}

export const initializePersistor = () => {
  if (persistor) {
    throw new Error('The persistor has already been initialized.')
  }
  if (!store) {
    throw new Error('The store has not been initialized.')
  }
  persistor = persistStore(store)
  return persistor
}

export const getStore = () => {
  if (!store) {
    throw new Error('The store has not been initialized.')
  }
  return store
}

export const getPersistor = () => {
  if (!persistor) {
    throw new Error('The persistor has not been initialized.')
  }
  return persistor
}
