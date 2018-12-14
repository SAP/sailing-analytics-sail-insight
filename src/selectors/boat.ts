import { BOAT_ENTITY_NAME } from 'api/schemas'
import { BOAT_FORM_NAME, FORM_KEY_NAME } from 'forms/boat'

import { getEntities, getEntityArrayByType, getEntityById } from './entity'
import { getFormFieldValue } from './form'


export const getBoatEntity = (state: any) => getEntities(state, BOAT_ENTITY_NAME)
export const getBoats = (state: any) => getEntityArrayByType(state, BOAT_ENTITY_NAME)
export const getBoat = (id?: string) => (state: any) => id && getEntityById(state, BOAT_ENTITY_NAME, id)

export const getFormBoatName = getFormFieldValue(BOAT_FORM_NAME, FORM_KEY_NAME)
