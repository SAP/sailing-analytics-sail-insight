import { filter, head } from 'lodash'
import { createSelector } from 'reselect'
import { toHashedString } from 'helpers/utils'
import { RootState } from 'reducers/config'
import * as teamForm from 'forms/team'
import { TeamTemplate } from 'models'
import { getEntities, getEntityArrayByType } from './entity'
import { getFormFieldValue } from './form'

import DeviceInfo from 'react-native-device-info'
import { getDeviceUuid } from 'helpers/uuid'

export const getDeviceId = () => getDeviceUuid(DeviceInfo.getUniqueID())
export const getHashedDeviceId = () => toHashedString(getDeviceId())
export const getUserImages = (state: RootState = {}) => getEntities(state, 'images', 'user')

const orderTeamsLastUsedDesc = (boats: TeamTemplate[]) => boats.sort((b1, b2) => {
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

const getUserTeamEntities = (state: RootState = {}) => getEntities(state, 'boats', 'user')
export const getOrderedUserTeams = (state: RootState = {}) => orderTeamsLastUsedDesc(getEntityArrayByType(
  state,
  'boats',
  { reducerName: 'user', omitId: true },
))

export const getUserTeams = createSelector(
  getOrderedUserTeams,
  getUserImages,
  (teams: TeamTemplate[], images: any) => teams.map((team: TeamTemplate) => ({
    ...team,
    imageData: team.imageUuid && images[team.imageUuid],
  }))
)

export const getUserBoatsByClass = (boatClass: string) => createSelector(
  getUserTeams,
  (boats: TeamTemplate[]) => filter(boats, { boatClass }),
)

export const getUserBoatByFormBoatName = createSelector(
  getUserTeamEntities,
  getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_NAME),
  (userBoats = {}, boatName) => userBoats[boatName],
)

export const getUserBoatByBoatName = (boatName?: string) => createSelector(
  getUserTeamEntities,
  (userBoats = {}) => boatName && userBoats[boatName],
)

export const getUserTeamByNameBoatClassNationalitySailnumber = (name: string, boatClass: string, nationality: string, sailNumber: string) => createSelector(
  getUserTeams,
  (boats: TeamTemplate[]) => head(filter(boats, { name, boatClass, nationality, sailNumber })),
)

export const getUserTeamsByFilter = (predicate: []) => createSelector(
  getUserTeams,
  (boats: TeamTemplate[]) => filter(boats, predicate),
)

export const getUserTeamNames = createSelector(
  getUserTeams,
  (userTeams = []) => userTeams.map((team: TeamTemplate) => team.name),
)

export const getLastUsedTeam = createSelector(
  getUserTeams,
  boats => head(boats),
)
