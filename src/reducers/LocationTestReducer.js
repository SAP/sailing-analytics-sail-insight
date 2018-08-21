import { handleActions } from 'redux-actions'

import { updateTrackedRegatta } from '../actions/locations'
import { addCheckIn } from 'actions/checkIn'


console.log('UZPCATE', updateTrackedRegatta)
console.log('cghec', addCheckIn)


const initialState = {
  active: {},
}

const reducer = handleActions({
  [updateTrackedRegatta]: (state = {}, action) => {
    console.log(action)
    debugger
    const leaderboardName = action.payload.leaderboardName
    if (!leaderboardName) {
      return state
    }
    return {
      ...state,
      active: {
        ...state.active,
        [leaderboardName]: action.payload,
      },
    }
  },
}, initialState)

export default reducer
