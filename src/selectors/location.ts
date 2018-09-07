import { DISTANCE_KEY, HEADING_IN_DEG_KEY, LOCATION_ACCURACY_KEY, LOCATION_TRACKING_REDUCER_NAME, SPEED_IN_KNOTS_KEY, START_AT_KEY, UNSENT_GPS_FIXES_KEY } from 'reducers/config'


export interface LocationStats {
  [LOCATION_ACCURACY_KEY]: number,
  [UNSENT_GPS_FIXES_KEY]: number,
  [SPEED_IN_KNOTS_KEY]: number,
  [START_AT_KEY]: string,
  [HEADING_IN_DEG_KEY]: number,
  [DISTANCE_KEY]: number,
}

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

export const getLocationStats: (state: any) => LocationStats = (state: any = {}) => {
  const data = state[LOCATION_TRACKING_REDUCER_NAME]
  return data && {
    [LOCATION_ACCURACY_KEY]: data.locationAccuracy,
    [UNSENT_GPS_FIXES_KEY]: data.unsentGpsFixCount,
    [SPEED_IN_KNOTS_KEY]: data.speedInKnots,
    [START_AT_KEY]: data.startedAt,
    [HEADING_IN_DEG_KEY]: data.headingInDeg,
    [DISTANCE_KEY]: data.distance,
  }
}
