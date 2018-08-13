import { handleActions } from 'redux-actions'

import {
  removeTrackedRegatta,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackedRegatta,
  updateTrackingStatus,
} from 'actions/locations'


const initialState = {
  status: null,
  leaderboardName: null,
  eventId: null,
}


const reducer = handleActions(
  {
    [updateTrackingStatus as any]: (state: any = {}, action) => ({
      ...state,
      status: action && action.payload,
    }),
    [updateTrackedLeaderboard as any]: (state: any = {}, action: any) => ({
      ...state,
      leaderboardName: action && action.payload,
    }),
    [updateTrackedEventId as any]: (state: any = {}, action: any) => ({
      ...state,
      eventId: action && action.payload,
    }),
    [updateTrackedRegatta as any]: (state: any = {}, action: any) =>
      !action || !action.payload ?
        state :
        ({
          ...state,
          eventId: action.payload.eventId,
          leaderboardName: action.payload.leaderboardName,
        }),
    [removeTrackedRegatta as any]: (state: any = {}) => ({
      ...state,
      eventId: null,
      leaderboardName: null,
    }),
  },
  initialState,
)

export default reducer
