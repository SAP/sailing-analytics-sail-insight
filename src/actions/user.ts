import { createAction } from 'redux-actions'

import { DispatchType } from 'helpers/types'
import { Boat } from 'models'


export const addOrUpdateUserBoat = createAction('ADD_USER_BOAT')
export const boatWasUsed = createAction('BOAT_WAS_USED')
export const removeBoat = createAction('REMOVE_BOAT')

export type SaveBoatAction = (
  boat: Boat,
  options?: {replaceBoatName?: string, updateLastUsed?: boolean},
) => any
export const saveBoat: SaveBoatAction = (boat, options = {}) => (dispatch: DispatchType) => {
  const { replaceBoatName, updateLastUsed } = options
  if (replaceBoatName) { dispatch(removeBoat(replaceBoatName)) }
  dispatch(addOrUpdateUserBoat(boat))
  if (updateLastUsed) { dispatch(boatWasUsed(boat.name)) }

  // TODO: save on backend
}

export type DeleteBoatAction = (name: string) => any
export const deleteBoat: DeleteBoatAction = name => (dispatch: DispatchType) => {
  // TODO: remove from backend

  dispatch(removeBoat(name))
}
