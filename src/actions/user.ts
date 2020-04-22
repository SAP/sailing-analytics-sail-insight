import { get, omit } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'
import { TeamTemplate } from 'models'

import { fetchCurrentUser } from 'actions/auth'
import { fetchEventList, saveCheckInToEventInventory } from 'actions/checkIn'
import { getNowAsMillis } from '../helpers/date'
import { saveFile } from '../helpers/files'
import Logger from '../helpers/Logger'
import { getActiveCheckInEntity } from 'selectors/checkIn'
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

  const teamWithImage = {
    ...omit(team, 'imageData'),
    imageUuid: await dispatch(uploadImage(team.imageData)),
  }

  // TODO Key should be replaces by unique key
  const newTeams = {
    ...(replaceTeamName ? omit(teams, replaceTeamName) : teams),
    [team.name]: teamWithImage,
  }
  await selfTrackingApi().updatePreference(TEAMS_PREFERENCE_KEY, newTeams)
  dispatch(updateTeams(newTeams))
}

export type updateTeamImageAction = (teamName: string, imageData?: any) => any
export const updateTeamImage: updateTeamImageAction = (teamName, imageData) =>
  async (dispatch: DispatchType) => {
    const teams = await fetchTeams()
    const teamToEdit = get(teams, teamName)
    if (!teamToEdit) {
      return
    }
    const teamWithNewImage = {
      ...teamToEdit,
      imageUuid: await dispatch(uploadImage(imageData)),
    }

    const newTeams = {
      ...teams,
      [teamName]: teamWithNewImage,
    }
    await selfTrackingApi().updatePreference(TEAMS_PREFERENCE_KEY, newTeams)
    dispatch(updateTeams(newTeams))
  }

const uploadImage = (imageData?: any) => async (dispatch: DispatchType) => {
  const uuid = imageData && imageData.uuid
  if (!uuid) {
    return undefined
  }

  dispatch(
    updateImages({
      imageData,
      imageUuid: uuid,
    }),
  )
  await selfTrackingApi().updatePreference(uuid, omit(imageData, 'path'))

  return uuid
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

export const syncEventList = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const checkIns = getActiveCheckInEntity(getState())

  // Have to first let the push to complete
  // Otherwise, if you joined an event anonymously which you have in your inventory
  // you may get stale data from the inventory first, before updating it with
  // saveCheckInToEventInventory calls.
  await Promise.all(
    Object.values(checkIns).map(saveCheckInToEventInventory)
  )

  return dispatch(fetchEventList())
}

export const fetchUserInfo = () => (dispatch: DispatchType) => Promise.all([
  dispatch(fetchCurrentUser()),
  fetchTeams().then((teams) => {
    dispatch(updateTeams(teams))
    return dispatch(fetchMissingImages(teams))
  })
])
