import { omit } from 'lodash'
import { handleActions } from 'redux-actions'

import { deleteMarkBinding, removeCheckIn, updateCheckInAction, updateDeletingMarkBinding, updateLoadingCheckInFlag } from 'actions/checkIn'
import { itemUpdateHandler } from 'helpers/reducers'
import { removeUserData } from '../actions/auth'
import { CheckInState } from './config'


const initialState: CheckInState = {
  active: {},
  isLoadingCheckIn: false,
  isDeletingMarkBinding: false,
}

const reducer = handleActions(
  {
    [updateLoadingCheckInFlag as any]: itemUpdateHandler('isLoadingCheckIn'),
    [updateDeletingMarkBinding as any]: itemUpdateHandler('isDeletingMarkBinding'),
    [deleteMarkBinding as any]: (state: any) => ({
      ...state,
      isDeletingMarkBinding: true,
    }),
    [updateCheckInAction as any]: (state: any = initialState, action) => {
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
