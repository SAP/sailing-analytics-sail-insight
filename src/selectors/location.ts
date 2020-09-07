import { RootState } from 'reducers/config'


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

export const getLocationTrackingStatus = (state: RootState = {}) =>
  state.locationTracking && state.locationTracking.status

export const getLocationTrackingContext = (state: RootState = {}) =>
state.locationTracking && state.locationTracking.context

export const getTrackedEventId = (state: RootState = {}) =>
  state.locationTracking && state.locationTracking.eventId

export const getTrackedLeaderboardName = (state: RootState = {}) =>
  state.locationTracking && state.locationTracking.leaderboardName

export const getUnsentGpsFixCount = (state: RootState = {}) =>
  state.locationTracking && state.locationTracking.unsentGpsFixCount

export const getLocationAccuracy = (state: RootState = {}) =>
  state.locationTracking && state.locationTracking.locationAccuracy

export const getLocationStats = (state: RootState = {}) => {
  const data = state.locationTracking
  return data && {
    locationAccuracy: data.locationAccuracy,
    unsentGpsFixCount: data.unsentGpsFixCount,
    speedInKnots: data.speedInKnots,
    startedAt: data.startedAt,
    headingInDeg: data.headingInDeg,
    distance: data.distance,
    lastLatitude: data.lastLatitude,
    lastLongitude: data.lastLongitude,
    lastWindDirection: data.lastWindCourse,
    lastWindSpeedInKnots: data.lastWindSpeedInKnots,
  } as LocationStats
}
