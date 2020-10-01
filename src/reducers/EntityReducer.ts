import {
  get, isArray, keys, mergeWith, set,
} from 'lodash'
import { handleActions } from 'redux-actions'

import {
  receiveEntities,
  removeEntities,
  removeEntity,
} from 'actions/entities'
import { filterEntityByIds, omitEntityElementsBy } from 'helpers/filter'
import { removeUserData } from '../actions/auth'


const entityMergeCustomizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return srcValue
  }
  return undefined
}

const reducer = handleActions(
  {
    [receiveEntities as any]: (state: any = {}, action: any) => {
      const entities = action && action.payload && action.payload.entities
      if (!entities) {
        return state
      }
      const newState = { ...state }

      keys(entities).forEach((entityTypeKey) => {
        const entityType = state[entityTypeKey] || {}
        newState[entityTypeKey] = action.payload.replace ? {} : { ...entityType }

        keys(entities[entityTypeKey]).forEach((entityKey) => {
          set(
            newState,
            [entityTypeKey, entityKey],
            mergeWith(
              get(state, [entityTypeKey, entityKey]) || {},
              entities[entityTypeKey][entityKey],
              entityMergeCustomizer,
            ),
          )
        })
      })
      return newState
    },
    [removeEntity as any]: (state: any = {}, action: any) => {
      const { entityType, id } = action.payload
      if (!get(state, [entityType, id])) {
        return state
      }
      const { [`${id}`]: removed, ...rest } = state[entityType]
      return {
        ...state,
        [entityType]: { ...rest },
      }
    },
    [removeEntities as any]: (state: any, action: any = {}) => {
      const { [`${action.payload.type}`]: removed, ...rest } = state

      const filter = action.payload && action.payload.filter
      const keepIds = action.payload && action.payload.keepIds
      const except = action.payload && action.payload.except
      if (except) {
        return {
          [action.payload.type]: filterEntityByIds(removed, except, true),
          ...rest,
        }
      }
      return {
        [action.payload.type]: omitEntityElementsBy(removed, filter, keepIds),
        ...rest,
      }
    },
    [removeUserData as any]: () => ({}),
  },
  {},
)


export default reducer
