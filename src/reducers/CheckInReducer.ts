import { handleActions } from 'redux-actions'

import { addCheckIn } from 'actions/checkIn'


const initialState = {
  active: {},
}

const reducer = handleActions(
  {
    [addCheckIn as any]: (state: any = {}, action) => {
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
  },
  initialState,
)

export default reducer
