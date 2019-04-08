import { REGATTA_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityById } from './entity'


export const getRegattaEntity = (state: any) => getEntities(state, REGATTA_ENTITY_NAME)
export const getRegatta = (name: string) => (state: any) => getEntityById(state, REGATTA_ENTITY_NAME, name)
