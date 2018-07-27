import { EVENT_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getEventEntity = state => getEntities(state, EVENT_ENTITY_NAME)
export const getEvents = state => getEntityArrayByType(state, EVENT_ENTITY_NAME)
export const getEvent = eventId => state => getEntityById(state, EVENT_ENTITY_NAME, eventId)
