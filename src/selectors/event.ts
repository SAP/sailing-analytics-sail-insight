import { EVENT_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'


export const getEventEntity = (state: any) => getEntities(state, EVENT_ENTITY_NAME)
export const getEvents = (state: any) => getEntityArrayByType(state, EVENT_ENTITY_NAME)
export const getEvent = (eventId: string) => (state: any) => getEntityById(state, EVENT_ENTITY_NAME, eventId)

export const getEventLocalState = (state: any) => state.events
