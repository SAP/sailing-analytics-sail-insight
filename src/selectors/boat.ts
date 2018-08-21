import { BOAT_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'


export const getBoatEntity = (state: any) => getEntities(state, BOAT_ENTITY_NAME)
export const getBoats = (state: any) => getEntityArrayByType(state, BOAT_ENTITY_NAME)
export const getBoat = (name: string) => (state: any) => getEntityById(state, BOAT_ENTITY_NAME, name)
