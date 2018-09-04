import { LOCATION_TRACKING_REDUCER_NAME } from 'reducers/config'


export const getLocationTrackingStatus = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].status

export const getTrackedEventId = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].eventId

export const getTrackedLeaderboardName = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].leaderboardName

export const getUnsentGpsFixCount = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].unsentGpsFixCount

export const getLocationAccuracy = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].locationAccuracy

export const getLocationStats = (state: any = {}) => {
  const data = state[LOCATION_TRACKING_REDUCER_NAME]
  return data && {
    locationAccuracy: data.locationAccuracy,
    unsentGpsFixCount: data.unsentGpsFixCount,
    speedInKnots: data.speedInKnots,
    startedAt: data.startedAt,
    headingInDeg: data.headingInDeg,
    distance: data.distance,
  }
}
