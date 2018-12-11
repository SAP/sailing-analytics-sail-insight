import { find, omit } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'
import { Boat } from 'models'

import { fetchCurrentUser } from 'actions/auth'
import { getUserBoats } from 'selectors/user'


const BOATS_PREFERENCE_KEY = 'boats'

export const addOrUpdateUserBoat = createAction('ADD_USER_BOAT')
export const boatWasUsed = createAction('BOAT_WAS_USED')
export const removeBoat = createAction('REMOVE_BOAT')
export const updateBoats = createAction('UPDATE_BOATS')

export type SaveBoatAction = (
  boat: Boat,
  options?: {replaceBoatName?: string, updateLastUsed?: boolean},
) => any
export const saveBoat: SaveBoatAction = (boat, options = {}) => async (dispatch: DispatchType) => {
  const boats = await selfTrackingApi.requestPreference(BOATS_PREFERENCE_KEY)
  const { updateLastUsed, replaceBoatName } = options
  const newBoats = {
    ...(replaceBoatName ? omit(boats, replaceBoatName) : boats),
    [boat.name]: boat,
  }
  await selfTrackingApi.updatePreference(
    BOATS_PREFERENCE_KEY,
    newBoats,
    )
  dispatch(updateBoats(newBoats))
  if (updateLastUsed) { dispatch(boatWasUsed(boat.name)) }
}

export const fetchBoats = () => async (dispatch: DispatchType) =>
    dispatch(updateBoats(await selfTrackingApi.requestPreference(BOATS_PREFERENCE_KEY)))

export type DeleteBoatAction = (name: string) => any
export const deleteBoat: DeleteBoatAction = name => async (dispatch: DispatchType) => {
  const newBoats = omit(await selfTrackingApi.requestPreference(BOATS_PREFERENCE_KEY), [name])
  await selfTrackingApi.updatePreference(BOATS_PREFERENCE_KEY, newBoats)
  dispatch(updateBoats(newBoats))
}

export const fetchUserInfo = () => async (dispatch: DispatchType) =>
  await dispatch(fetchCurrentUser()) && dispatch(fetchBoats())

export const getBoatFromValues = (boat: any) => (dispatch: DispatchType, getState: GetStateType) => find(
  getUserBoats(getState()),
  boat,
)

export const updateBoatId = (boatValues: any, id: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const boat = dispatch(getBoatFromValues(boatValues))
  return boat && dispatch(saveBoat({ id, ...boat }))
}
