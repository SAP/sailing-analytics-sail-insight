import { handleActions } from 'redux-actions'
import {
  get, isArray, keys, set, mergeWith,
} from 'lodash'

import {
  receiveEntities,
  removeEntities,
  removeEntity,
} from 'actions/entities'
import { omitEntityElementsBy, filterEntityByIds } from 'helpers/filter'


const entityMergeCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return srcValue
  }
  return undefined
}

const reducer = handleActions({
  [receiveEntities]: (state = {}, action) => {
    const entities = action?.payload?.entities
    if (!entities) {
      return state
    }

    const newState = { ...state }
    keys(entities).forEach((entityTypeKey) => {
      const entityType = state[entityTypeKey] || {}
      newState[entityTypeKey] = { ...entityType }
      keys(entities[entityTypeKey]).forEach((entityKey) => {
        set(
          newState,
          `${entityTypeKey}.${entityKey}`,
          mergeWith(
            get(state, `${entityTypeKey}.${entityKey}`, {}),
            entities[entityTypeKey][entityKey],
            entityMergeCustomizer,
          ),
        )
      })
    })
    return newState
  },
  [removeEntity]: (state, action) => {
    const { entityType, id } = action.payload
    if (!get(state, `[${entityType}][${id}]`)) {
      return state
    }
    const { [`${id}`]: removed, ...rest } = state[entityType]
    return {
      ...state,
      [entityType]: { ...rest },
    }
  },
  [removeEntities]: (state, action) => {
    const { [`${action.payload.type}`]: removed, ...rest } = state

    const filter = action?.payload?.filter
    const keepIds = action?.payload?.keepIds
    const except = action?.payload?.except
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
}, {})


export default reducer
