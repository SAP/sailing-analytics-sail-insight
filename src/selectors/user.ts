import { head } from 'lodash'
import { createSelector } from 'reselect'

import { USER_REDUCER_NAME, UserReducerKeys } from 'reducers/config'

import * as boatForm from 'forms/boat'
import { Boat } from 'models'

import { getEntities, getEntityArrayByType } from './entity'
import { getFormFieldValue } from './form'


const orderBoatsLastUsedDesc = (boats: Boat[]) => boats.sort((b1, b2) => {
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

const getUserBoatEntities = (state: any = {}) => getEntities(state, UserReducerKeys.BOATS, USER_REDUCER_NAME)
export const getUserBoats = (state: any = {}) => orderBoatsLastUsedDesc(getEntityArrayByType(
  state,
  UserReducerKeys.BOATS,
  { reducerName: USER_REDUCER_NAME },
))

export const getUserBoatByFormBoatName = createSelector(
  getUserBoatEntities,
  getFormFieldValue(boatForm.BOAT_FORM_NAME, boatForm.FORM_KEY_NAME),
  (userBoats = {}, boatName) => userBoats[boatName],
)

export const getUserBoatNames = createSelector(
  getUserBoats,
  (userBoats = []) => userBoats.map((boat: Boat) => boat.name),
)

export const getLastUsedBoat = createSelector(
  getUserBoats,
  boats => head(boats),
)
