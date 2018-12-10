import { omit } from 'lodash'
import { handleActions } from 'redux-actions'

import { removeCheckIn, updateCheckIn, updateLoadingCheckInFlag } from 'actions/checkIn'
import { itemUpdateHandler } from 'helpers/reducers'
import { CheckInState } from './config'


const initialState: CheckInState = {
  active: {},
  isLoadingCheckIn: false,
}

const reducer = handleActions(
  {
    [updateLoadingCheckInFlag as any]: itemUpdateHandler('isLoadingCheckIn'),
    [updateCheckIn as any]: (state: any = initialState, action) => {
      const leaderboardName = action.payload.leaderboardName
      if (!leaderboardName) {
        return state
      }
      return {
        ...state,
        active: {
          ...state.active,
          [leaderboardName]: { ...state.active[leaderboardName], ...action.payload },
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
