import { omit } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType } from 'helpers/types'
import { TeamTemplate } from 'models'

import { fetchCurrentUser } from 'actions/auth'
import { getNowAsMillis } from '../helpers/date'


const TEAMS_PREFERENCE_KEY = 'boats'

export const addOrUpdateUserBoat = createAction('ADD_USER_BOAT')
export const teamWasUsed = createAction('BOAT_WAS_USED')
export const removeTeam = createAction('REMOVE_BOAT')
export const updateTeams = createAction('UPDATE_BOATS')

export type SaveTeamAction = (
  team: TeamTemplate,
  options?: {replaceTeamName?: string, updateLastUsed?: boolean},
) => any

export const saveTeam: SaveTeamAction = (team, options = {}) => async (dispatch: DispatchType) => {
  const teams = await fetchTeams()
  const { updateLastUsed, replaceTeamName } = options

  if (updateLastUsed) {
    team.lastUsed = getNowAsMillis()
  }
  // TODO Key should be replaces by unique key
  const newTeams = {
    ...(replaceTeamName ? omit(teams, replaceTeamName) : teams),
    [team.name]: team,
  }
  await selfTrackingApi().updatePreference(TEAMS_PREFERENCE_KEY, newTeams)
  dispatch(updateTeams(newTeams))
}

export const fetchTeams = async () => {
  return (await selfTrackingApi().requestPreference(TEAMS_PREFERENCE_KEY) || [])
}

export type DeleteTeamAction = (name: string) => any
export const deleteTeam: DeleteTeamAction = name => async (dispatch: DispatchType) => {
  const newBoats = omit(await selfTrackingApi().requestPreference(TEAMS_PREFERENCE_KEY), [name])
  await selfTrackingApi().updatePreference(TEAMS_PREFERENCE_KEY, newBoats)
  dispatch(updateTeams(newBoats))
}

export const fetchUserInfo = () => async (dispatch: DispatchType) => {
  const teams = await fetchTeams()
  dispatch(updateTeams(teams))
  await dispatch(fetchCurrentUser())
}
