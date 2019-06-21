import { BOAT_ENTITY_NAME } from 'api/schemas'
import { FORM_KEY_TEAM_NAME, TEAM_FORM_NAME } from 'forms/team'

import { getEntities, getEntityArrayByType, getEntityById } from './entity'
import { getFormFieldValue } from './form'


export const getBoatEntity = (state: any) => getEntities(state, BOAT_ENTITY_NAME)
export const getBoats = (state: any) => getEntityArrayByType(state, BOAT_ENTITY_NAME)
export const getBoat = (id?: string) => (state: any) => id && getEntityById(state, BOAT_ENTITY_NAME, id)

export const getFormTeamName = getFormFieldValue(TEAM_FORM_NAME, FORM_KEY_TEAM_NAME)
