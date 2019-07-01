import { getEntities, getEntityById } from './entity'

export const getEventEntity = (state: any) => getEntities(state, 'all', 'events')
// export const getEvents = (state: any) => getEntityArrayByType(state, EVENT_ENTITY_NAME)
export const getEvent = (eventId: string) => (state: any) =>
  getEntityById(state, 'all', eventId, { reducerName: 'events' })
