import { handleActions } from 'redux-actions'

import { updateTrackingStatus, updateTrackedLeaderboard } from 'actions/locations'


const initialState = {
  status: null,
  leaderboardName: null,
}

const reducer = handleActions({
  [updateTrackingStatus]: (state = {}, action) => ({
    ...state,
    status: action?.payload,
  }),
  [updateTrackedLeaderboard]: (state = {}, action) => ({
    ...state,
    leaderboardName: action?.payload,
  }),
}, initialState)

export default reducer
