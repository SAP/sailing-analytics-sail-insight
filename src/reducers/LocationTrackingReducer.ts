import { handleActions } from 'redux-actions'

import {
  removeTrackedRegatta,
  setTrackedRegatta,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackingStatus,
} from 'actions/locations'


const initialState = {
  status: null,
  leaderboardName: null,
  eventId: null,
}

const actionHandlers = {
  [updateTrackingStatus as any]: (state: any = {}, action: any) => ({
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
  [setTrackedRegatta as any]: (state: any = {}, action: any) =>
    !action || !action.payload ?
      state :
    {
      ...state,
      eventId: action.payload.eventId,
      leaderboardName: action.payload.leaderboardName,
    },
  [removeTrackedRegatta as any]: (state: any = {}) => ({
    ...state,
    eventId: null,
    leaderboardName: null,
  }),
}

const reducer = handleActions(actionHandlers, initialState)

export default reducer
