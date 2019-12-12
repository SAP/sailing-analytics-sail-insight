import { MARK_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityById } from './entity'


export const getMarkEntity = (state: any) => getEntities(state, MARK_ENTITY_NAME)
export const getMark = (id?: string) => (state: any) => id && getEntityById(state, MARK_ENTITY_NAME, id)
