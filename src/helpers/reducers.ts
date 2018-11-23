import { get, set } from 'lodash'
import { Action } from 'redux-actions'

import { currentTimestampAsText, getNowAsMillis } from './date'


export const itemUpdateHandler = (itemKey: string) => (state: any = {}, action: Action<any>) => ({
  ...state,
  [itemKey]: action && action.payload,
})


const createTimestampHandler = (generateTimeStamp: () => any) => (itemPath: string | string[]) => (state: any = {}) => {
  const newState = {
    ...state,
  }
  return set(newState, itemPath, generateTimeStamp())
}
export const timestampUpdateHandler = createTimestampHandler(() => currentTimestampAsText())
export const unixTimestampUpdateHandler = createTimestampHandler(getNowAsMillis())


export interface UpdateEntityOptions {entityType: string, id: string, data?: any}

export const updateEntity = (
  state: any = {},
  options: UpdateEntityOptions,
) => {
  if (!options || !options.entityType || !options.id) {
    return state
  }
  return {
    ...state,
    [options.entityType]: {
      ...state[options.entityType],
      [options.id]: {
        ...get(state, [options.entityType, options.id], {}),
        ...(options.data || {}),
      },
    },
  }
}

export const removeEntity = (state: any, options: UpdateEntityOptions) => {
  if (!options || !options.entityType || !options.id) {
    return state
  }
  const { entityType, id } = options
  if (!get(state, [entityType, id])) {
    return state
  }
  const { [id]: removed, ...rest } = state[entityType]
  return {
    ...state,
    [entityType]: { ...rest },
  }
}
