import { BOAT_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getBoatEntity = state => getEntities(state, BOAT_ENTITY_NAME)
export const getBoats = state => getEntityArrayByType(state, BOAT_ENTITY_NAME)
export const getBoat = name => state => getEntityById(state, BOAT_ENTITY_NAME, name)
