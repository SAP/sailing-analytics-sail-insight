import { get, set } from 'lodash'
import { handleActions } from 'redux-actions'

import { addOrUpdateUserBoat, boatWasUsed, removeBoat } from 'actions/user'
import { getNowAsMillis } from 'helpers/date'

import { removeEntity } from 'helpers/reducers'
import { UserReducerKeys } from './config'


const initialState = {
  [UserReducerKeys.CURRENT_BOAT]: null,
  [UserReducerKeys.BOATS]: {},
}

const reducer = handleActions(
  {
    [addOrUpdateUserBoat as any]: (state: any = {}, action?: any) => {
      if (!action || !action.payload || !action.payload.name) {
        return state
      }
      return {
        ...state,
        [UserReducerKeys.BOATS]: {
          ...state[UserReducerKeys.BOATS],
          [action.payload.name]: action.payload,
        },
      }
    },
    [boatWasUsed as any]: (state: any = {}, action?: any) => {
      if (!action || !action.payload) {
        return state
      }
      const boat = get(state, [UserReducerKeys.BOATS, action.payload])
      if (!boat) {
        return state
      }
      const newState = { ...state }
      return set(newState, [UserReducerKeys.BOATS, action.payload, 'lastUsed'], getNowAsMillis())
    },
    [removeBoat as any]: (state: any = {}, action?: any) => removeEntity(
      state,
      { entityType: UserReducerKeys.BOATS, id: action.payload },
    ),
  },
  initialState,
)

export default reducer
