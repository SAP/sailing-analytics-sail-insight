import { omit } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType } from 'helpers/types'
import { TeamTemplate } from 'models'

import { fetchCurrentUser } from 'actions/auth'


const BOATS_PREFERENCE_KEY = 'boats'

export const addOrUpdateUserBoat = createAction('ADD_USER_BOAT')
export const boatWasUsed = createAction('BOAT_WAS_USED')
export const removeBoat = createAction('REMOVE_BOAT')
export const updateBoats = createAction('UPDATE_BOATS')

export type SaveBoatAction = (
  boat: TeamTemplate,
  options?: {replaceBoatName?: string, updateLastUsed?: boolean},
) => any

export const saveBoat: SaveBoatAction = (boat, options = {}) => async (dispatch: DispatchType) => {
  const boats = await fetchBoats()
  const { updateLastUsed, replaceBoatName } = options
  const newBoats = {
    ...(replaceBoatName ? omit(boats, replaceBoatName) : boats),
    [boat.name]: boat,
  }
  await selfTrackingApi().updatePreference(
    BOATS_PREFERENCE_KEY,
    newBoats,
    )
  dispatch(updateBoats(newBoats))
  if (updateLastUsed) { dispatch(boatWasUsed(boat.name)) }
}

export const fetchBoats = async () => {
  return (await selfTrackingApi().requestPreference(BOATS_PREFERENCE_KEY) || [])
}

export type DeleteBoatAction = (name: string) => any
export const deleteBoat: DeleteBoatAction = name => async (dispatch: DispatchType) => {
  const newBoats = omit(await selfTrackingApi().requestPreference(BOATS_PREFERENCE_KEY), [name])
  await selfTrackingApi().updatePreference(BOATS_PREFERENCE_KEY, newBoats)
  dispatch(updateBoats(newBoats))
}

export const fetchUserInfo = () => async (dispatch: DispatchType) => {
  const boats = await fetchBoats()
  dispatch(updateBoats(boats))
  await dispatch(fetchCurrentUser())
}
