import { handleActions } from 'redux-actions'

import { distanceInM } from 'helpers/physics'
import { itemUpdateHandler } from 'helpers/reducers'
import { PositionFix } from 'models'
import { isPositionFix } from 'models/PositionFix'
import { LocationTrackingState } from 'reducers/config'

import {
  removeTrackedRegatta,
  updateLastWindCourse,
  updateLastWindSpeed,
  updateStartAutoCourseStatus,
  updateStartedAt,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackedRegatta,
  updateTrackingStartTimeUpdateFlag,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
  updateValidGpsFixCount,
} from 'actions/locationTrackingData'
import { removeUserData } from '../actions/auth'


const initialState: LocationTrackingState = {
  status: null,
  leaderboardName: null,
  eventId: null,
  unsentGpsFixCount: null,
  locationAccuracy: null,
  speedInKnots: null,
  startedAt: null,
  headingInDeg: null,
  distance: 0,
  lastLatitude: null,
  lastLongitude: null,
  lastWindCourse: null,
  lastWindSpeedInKnots: null,
  wasTrackingStartTimeUpdated: false,
  startAutoCourseUpdateStatus: 'MISSING',
  validGpsFixCount: 0,
}

const reducer = handleActions(
  {
    [updateTrackingStatus as any]: itemUpdateHandler('status'),
    [updateTrackedLeaderboard as any]: itemUpdateHandler('leaderboardName'),
    [updateTrackedEventId as any]: itemUpdateHandler('eventId'),
    [updateUnsentGpsFixCount as any]: itemUpdateHandler('unsentGpsFixCount'),
    [updateLastWindCourse as any]: itemUpdateHandler('lastWindCourse'),
    [updateLastWindSpeed as any]: itemUpdateHandler('lastWindSpeedInKnots'),
    [updateStartedAt as any]: itemUpdateHandler('startedAt'),
    [updateTrackingStartTimeUpdateFlag as any]: itemUpdateHandler('wasTrackingStartTimeUpdated'),
    [updateValidGpsFixCount as any]: itemUpdateHandler('validGpsFixCount'),
    [updateStartAutoCourseStatus as any]: itemUpdateHandler('startAutoCourseUpdateStatus'),
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
    [updateTrackingStatistics as any]: (state: any = {}, action: any = {}) => {
      let gpsFix: PositionFix
      if (!isPositionFix(action.payload)) {
        return state
      }
      gpsFix = action.payload

      const { lastLatitude, lastLongitude } = state
      const distance = !lastLatitude || !lastLongitude ?
        state.distance :
        state.distance + distanceInM(lastLatitude, lastLongitude, gpsFix.latitude, gpsFix.longitude)

      const locationAccuracy = typeof gpsFix.accuracy === 'number' ?
          gpsFix.accuracy :
          null

      const speedInKnots = typeof gpsFix.speedInKnots === 'number' && gpsFix.speedInKnots > -1 ?
          gpsFix.speedInKnots :
          null

      const headingInDeg = typeof gpsFix.bearingInDeg === 'number' && gpsFix.bearingInDeg > -1 ?
          gpsFix.bearingInDeg :
          null

      return ({
        ...state,
        locationAccuracy,
        speedInKnots,
        headingInDeg,
        distance,
        lastLatitude: gpsFix.latitude,
        lastLongitude: gpsFix.longitude,
      })
    },
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
