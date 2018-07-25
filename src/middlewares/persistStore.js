import asyncStore from 'react-native-simple-store'
import { get, includes } from 'lodash'


export const STORAGE_NAMESPACE = '@MidnightRunners'
export const PERSIST_REDUCERS = [
]


const ON_SAVE_ACTIONS = [
]

export default store => next => (action) => {
  if (includes(ON_SAVE_ACTIONS, action?.type)) {
    const nextValue = next(action)
    const state = store.getState()
    PERSIST_REDUCERS.map((name) => {
      const value = get(state, name)
      if (!value) {
        return null
      }
      return asyncStore.save(`${STORAGE_NAMESPACE}:${name}`, JSON.stringify(value))
    })
    return nextValue
  }

  next(action)
  return null // clear state
}
