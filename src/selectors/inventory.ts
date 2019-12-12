import { MARK_PROPERTIES_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType} from './entity'

export const getMarkProperties = (state: any) =>
    getEntityArrayByType(state, MARK_PROPERTIES_ENTITY_NAME)