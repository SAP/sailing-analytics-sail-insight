import { MARK_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getMarkEntity = state => getEntities(state, MARK_ENTITY_NAME)
export const getMarks = state => getEntityArrayByType(state, MARK_ENTITY_NAME)
export const getMark = name => state => getEntityById(state, MARK_ENTITY_NAME, name)
