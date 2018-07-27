import { handleActions } from 'redux-actions'

import { updateCurrentCheckIn } from 'actions/checkIn'


const initialState = {
  data: null,
}

const reducer = handleActions({
  [updateCurrentCheckIn]: (state = {}, action = {}) => ({
    ...state,
    data: action.payload,
  }),
}, initialState)

export default reducer
