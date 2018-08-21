import { MARK_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getMarkEntity = (state: any) => getEntities(state, MARK_ENTITY_NAME)
export const getMarks = (state: any) => getEntityArrayByType(state, MARK_ENTITY_NAME)
export const getMark = (name: string) => (state: any) => getEntityById(state, MARK_ENTITY_NAME, name)
