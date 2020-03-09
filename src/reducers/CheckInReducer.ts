import { omit } from 'lodash'
import { handleActions } from 'redux-actions'

import { removeCheckIn, updateCheckIn, updateLoadingCheckInFlag, updateLoadingSplashFlag } from 'actions/checkIn'
import { itemUpdateHandler } from 'helpers/reducers'
import { removeUserData } from '../actions/auth'
import { CheckInState } from './config'


const initialState: CheckInState = {
  active: {},
  isLoadingCheckIn: false,
  isLoadingSplash: true,
}

const reducer = handleActions(
  {
    [updateLoadingCheckInFlag as any]: itemUpdateHandler('isLoadingCheckIn'),
    [updateLoadingSplashFlag as any]: itemUpdateHandler('isLoadingSplash'),
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
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
