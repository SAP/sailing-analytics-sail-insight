import { omit } from 'lodash'
import { handleActions } from 'redux-actions'

import { addCheckIn, removeCheckIn } from 'actions/checkIn'


const initialState = {
  active: {},
}

const reducer = handleActions(
  {
    [addCheckIn as any]: (state: any = initialState, action) => {
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
    [removeCheckIn as any]: (state: any = initialState, action) => {
      const leaderboardName = action.payload.leaderboardName
      if (!leaderboardName) {
        return state
      }
      return {
        ...state,
        active: omit(state.active, [leaderboardName]),
      }
    },
  },
  initialState,
)

export default reducer
