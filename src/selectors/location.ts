import { LOCATION_TRACKING_REDUCER_NAME, LocationTrackingReducerKeys as Keys } from 'reducers/config'


export interface LocationStats {
  locationAccuracy?: number,
  unsentGpsFixCount?: number,
  speedInKnots?: number,
  startedAt?: string,
  headingInDeg?: number,
  distance?: number,
  lastLatitude?: number,
  lastLongitude?: number,
  lastWindDirection?: number,
  lastWindSpeedInKnots?: number,
}

export const getLocationTrackingStatus = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.STATUS_KEY]

export const getTrackedEventId = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.EVENT_ID_KEY]

export const getTrackedLeaderboardName = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.LEADERBOARD_NAME_KEY]

export const getUnsentGpsFixCount = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.UNSENT_GPS_FIXES_KEY]

export const getLocationAccuracy = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.LOCATION_ACCURACY_KEY]

export const getLocationStats: (state: any) => LocationStats = (state: any = {}) => {
  const data = state[LOCATION_TRACKING_REDUCER_NAME]
  return data && {
    locationAccuracy: data[Keys.LOCATION_ACCURACY_KEY],
    unsentGpsFixCount: data[Keys.UNSENT_GPS_FIXES_KEY],
    speedInKnots: data[Keys.SPEED_IN_KNOTS_KEY],
    startedAt: data[Keys.START_AT_KEY],
    headingInDeg: data[Keys.HEADING_IN_DEG_KEY],
    distance: data[Keys.DISTANCE_KEY],
    lastLatitude: data[Keys.LAST_LATITUDE_KEY],
    lastLongitude: data[Keys.LAST_LONGITUDE_KEY],
    lastWindDirection: data[Keys.LAST_WIND_DIRECTION],
    lastWindSpeedInKnots: data[Keys.LAST_WIND_SPEED_IN_KNOTS],
  }
}

export const wasTrackingStartTimeUpdated = (state: any) =>
  state[LOCATION_TRACKING_REDUCER_NAME] &&
  state[LOCATION_TRACKING_REDUCER_NAME][Keys.WAS_TRACKING_START_TIME_UPDATED]
