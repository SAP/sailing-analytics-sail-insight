import { COMPETITOR_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getCompetitorEntity = state => getEntities(state, COMPETITOR_ENTITY_NAME)
export const getCompetitors = state => getEntityArrayByType(state, COMPETITOR_ENTITY_NAME)
export const getCompetitor = name => state => getEntityById(state, COMPETITOR_ENTITY_NAME, name)
