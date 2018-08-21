import { COMPETITOR_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'


export const getCompetitorEntity = (state: any) => getEntities(state, COMPETITOR_ENTITY_NAME)
export const getCompetitors = (state: any) => getEntityArrayByType(state, COMPETITOR_ENTITY_NAME)
export const getCompetitor = (name: string) => (state: any) => getEntityById(state, COMPETITOR_ENTITY_NAME, name)
