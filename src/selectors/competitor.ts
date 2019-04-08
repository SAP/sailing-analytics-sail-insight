import { COMPETITOR_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'


export const getCompetitorEntity = (state: any) => getEntities(state, COMPETITOR_ENTITY_NAME)
export const getCompetitors = (state: any) => getEntityArrayByType(state, COMPETITOR_ENTITY_NAME)
export const getCompetitor = (id?: string) => (state: any) => id && getEntityById(state, COMPETITOR_ENTITY_NAME, id)
