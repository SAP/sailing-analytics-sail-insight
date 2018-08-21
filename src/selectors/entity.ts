import { get, keys } from 'lodash'

/**
 * Transform one entitiy from an object of entities into a single object with an ID parameter
 *
 * @param {object} payload - object of entities for a certain type
 * @param {string} idParam  - parameter to use to save the keys (IDs) default is 'id'
 *
 * @param {number} entityId - The ID of the entity you want returned.
 * This works well with .map on keys(<Object>)
 * @returns {object} - A new entity object with an ID according to @idParam
 */
const omitEntityId = (payload: any, idParam = 'id') => (entityId: string) => ({
  [idParam]: entityId,
  ...payload[entityId],
})

/**
 * Returns all entities of a certain type from the store, otherwise returns an empty object
 *
 * @param {object} state
 * @param {string} type - Entity type to filter by
 *
 * @returns {object} - object of entities or empty array
 */
export const getEntities = (state: any, type: string) => get(state.entities, type)

/**
 * Returns all entities of a certain type from the store as an array,
 * with the entity's IDs saved as @idParam
 *
 * @param {object} state
 * @param {string} type - Entity type to filter by
 * @param {string} idParam  - parameter to use to save the keys (IDs) default is 'id'
 */
export const getEntityArrayByType = (state: any, type: string, idParam?: string) => {
  const entities = getEntities(state, type)

  if (entities) {
    return keys(entities)
      .map(omitEntityId(entities, idParam))
  }

  return []
}

/**
 * Returns a single entity of a certain type from the store,
 * with the entity's ID saved according to @idParam
 *
 * @param {object} state
 * @param {string} type - Entity type to filter by
 * @param {string} id - The desireds entity ID
 * @param {string} idParam  - parameter to use to save the keys (IDs) default is 'id'
 */
export const getEntityById = (state: any, type: string, id: string, idParam?: string) => {
  const entities = getEntities(state, type)

  if (!entities || !entities[id]) {
    return undefined
  }
  return omitEntityId(entities, idParam)(id)
}
