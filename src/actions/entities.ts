import { DispatchType } from 'helpers/types'
import { get, isArray } from 'lodash'
import { createAction } from 'redux-actions'


const getIdsAsArray = (normalizedData: any) => {
  const memberIds = get(normalizedData, 'result', [])
  return memberIds && !isArray(memberIds) ? [memberIds] : memberIds
}

/**
 * @param {Object} payload - Action Payload
 * @param {array|string} payload.result - Entity ID/Entity IDs
 * @param {Object[]} payload.entities - Entities by Type (singular)
 * @param {Object[string]} payload.entities[entity] - Object of ID/Entity pairs
 */
export const receiveEntities = createAction('RECEIVE_ENTITIES')
export const removeEntity = createAction('REMOVE_ENTITY')
export const removeEntities = createAction('REMOVE_ENTITIES')

export const receivePaginatedEntities = (payload: any) => async (dispatch: DispatchType) => {
  if (!payload) {
    return null
  }
  await dispatch(receiveEntities(payload.data))
  return {
    next: payload.next,
    result: getIdsAsArray(payload.data),
  }
}
