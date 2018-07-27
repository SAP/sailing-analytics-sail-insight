import { EVENT_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById } from './entity'


export const getEvents = state => getEntityArrayByType(state, EVENT_ENTITY_NAME)

export const getEvent = (state, eventId) => getEntityById(state, EVENT_ENTITY_NAME, eventId)
