import { handleActions } from 'redux-actions'

import {
  removeTrackedRegatta,
  updateHeadingInDeg,
  updateLocationAccuracy,
  updateSpeedInKnots,
  updateStartedAt,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackedRegatta,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
} from 'actions/locations'


const initialState = {
  status: null,
  leaderboardName: null,
  eventId: null,
  unsentGpsFixCount: null,
  locationAccuracy: null,
  speedInKnots: null,
  startAt: null,
  headingInDeg: null,
}

const itemUpdateHandler = (itemKey: string) => (state: any = {}, action: any) => ({
  ...state,
  [itemKey]: action && action.payload,
})

const reducer = handleActions(
  {
    [updateTrackingStatus as any]: itemUpdateHandler('status'),
    [updateTrackedLeaderboard as any]: itemUpdateHandler('leaderboardName'),
    [updateTrackedEventId as any]: itemUpdateHandler('eventId'),
    [updateLocationAccuracy as any]: itemUpdateHandler('locationAccuracy'),
    [updateUnsentGpsFixCount as any]: itemUpdateHandler('unsentGpsFixCount'),
    [updateSpeedInKnots as any]: itemUpdateHandler('speedInKnots'),
    [updateStartedAt as any]: itemUpdateHandler('startedAt'),
    [updateHeadingInDeg as any]: itemUpdateHandler('headingInDeg'),
    [updateTrackedRegatta as any]: (state: any = {}, action: any) =>
      !action || !action.payload ?
        state :
        ({
          ...state,
          eventId: action.payload.eventId,
          leaderboardName: action.payload.leaderboardName,
          unsentGpsFixCount: null,
          locationAccuracy: null,
        }),
    [removeTrackedRegatta as any]: (state: any = {}) => ({
      ...state,
      status: state.status,
      ...initialState,
    }),
  },
  initialState,
)

export default reducer
