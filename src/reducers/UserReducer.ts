import { get, set } from 'lodash'
import { handleActions } from 'redux-actions'

import { addOrUpdateUserBoat, boatWasUsed, removeBoat, updateBoats } from 'actions/user'
import { getNowAsMillis } from 'helpers/date'
import { removeEntity } from 'helpers/reducers'

import { UserState } from 'reducers/config'
import { removeUserData } from '../actions/auth'


const initialState: UserState = {
  currentBoat: null,
  boats: {},
}

const reducer = handleActions(
  {
    [updateBoats as any]: (state: any = {}, action?: any) => {
      if (!action) {
        return state
      }
      return {
        ...state,
        boats: action.payload || {},
      }
    },
    [addOrUpdateUserBoat as any]: (state: UserState = {}, action?: any) => {
      if (!action || !action.payload || !action.payload.name) {
        return state
      }
      return {
        ...state,
        boats: {
          ...state.boats,
          [action.payload.name]: action.payload,
        },
      }
    },
    [boatWasUsed as any]: (state: UserState = {}, action?: any) => {
      if (!action || !action.payload) {
        return state
      }
      const boat = get(state.boats, action.payload)
      if (!boat) {
        return state
      }
      const newState = { ...state }
      return set(newState, ['boats', action.payload, 'lastUsed'], getNowAsMillis())
    },
    [removeBoat as any]: (state: any = {}, action?: any) => removeEntity(
      state,
      { entityType: 'boats', id: action.payload },
    ),
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
