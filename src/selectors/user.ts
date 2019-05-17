import { filter, head } from 'lodash'
import { createSelector } from 'reselect'

import { RootState } from 'reducers/config'

import * as teamForm from 'forms/team'
import { TeamTemplate } from 'models'

import { getEntities, getEntityArrayByType } from './entity'
import { getFormFieldValue } from './form'


const orderBoatsLastUsedDesc = (boats: TeamTemplate[]) => boats.sort((b1, b2) => {
  if (!b1.lastUsed && !b2.lastUsed) {
    return 0
  }
  if (!b1.lastUsed) {
    return 1
  }
  if (!b2.lastUsed) {
    return -1
  }
  return b2.lastUsed - b1.lastUsed
})

const getUserBoatEntities = (state: RootState = {}) => getEntities(state, 'boats', 'user')
export const getUserTeams = (state: RootState = {}) => orderBoatsLastUsedDesc(getEntityArrayByType(
  state,
  'boats',
  { reducerName: 'user', omitId: true },
))

export const getUserBoatsByClass = (boatClass: string) => createSelector(
  getUserTeams,
  (boats: TeamTemplate[]) => filter(boats, { boatClass }),
)

export const getUserBoatByFormBoatName = createSelector(
  getUserBoatEntities,
  getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_NAME),
  (userBoats = {}, boatName) => userBoats[boatName],
)

export const getUserBoatNames = createSelector(
  getUserTeams,
  (userBoats = []) => userBoats.map((boat: TeamTemplate) => boat.name),
)

export const getLastUsedBoat = createSelector(
  getUserTeams,
  boats => head(boats),
)
