import { get, omit } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'
import { TeamTemplate } from 'models'

import { fetchCurrentUser } from 'actions/auth'
import { getNowAsMillis } from '../helpers/date'
import { saveFile } from '../helpers/files'
import Logger from '../helpers/Logger'
import { getUserImages } from '../selectors/user'


const TEAMS_PREFERENCE_KEY = 'boats'

export const addOrUpdateUserBoat = createAction('ADD_USER_BOAT')
export const teamWasUsed = createAction('BOAT_WAS_USED')
export const removeTeam = createAction('REMOVE_BOAT')
export const updateTeams = createAction('UPDATE_BOATS')
export const updateImages = createAction('UPDATE_IMAGES')

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

  team.imageUuid = get(team, ['imageData', 'uuid'])

  // TODO Key should be replaces by unique key
  const newTeams = {
    ...(replaceTeamName ? omit(teams, replaceTeamName) : teams),
    [team.name]: omit(team, 'imageData'),
  }
  await selfTrackingApi().updatePreference(TEAMS_PREFERENCE_KEY, newTeams)
  dispatch(updateTeams(newTeams))
  if (team.imageUuid) {
    dispatch(
      updateImages({
        imageUuid: team.imageUuid,
        imageData: team.imageData,
      }),
    )
    await selfTrackingApi().updatePreference(team.imageUuid, omit(team.imageData, 'path'))
  }
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

export const fetchMissingImages = (teams: any[]) => async (dispatch: DispatchType, getState: GetStateType) => {
  const teamImages = getUserImages(getState())
  const imagePromises = Object.values(teams).map(async ({ imageUuid }: any) => {
    if (imageUuid && !Object.keys(teamImages).includes(imageUuid)) {
      const image = await selfTrackingApi().requestPreference(imageUuid)
      const imageData = image && image.data

      if (!image || !imageData) {
        // Bad data from the server
        Logger.debug('Bad image got from server')
        return
      }

      let imagePath
      try {
        imagePath = await saveFile(imageData, imageUuid)
      } catch (err) {
        // Saving image to device failed
        Logger.debug('Saving image to device failed')
        return
      }

      image.path = `file://${imagePath}`

      dispatch(
        updateImages({
          imageUuid,
          imageData: image,
        }),
      )
    }
  })

  await Promise.all(imagePromises)
}

export const fetchUserInfo = () => async (dispatch: DispatchType) => {
  const teams = await fetchTeams()
  dispatch(updateTeams(teams))
  await dispatch(fetchMissingImages(teams))
  await dispatch(fetchCurrentUser())
}
