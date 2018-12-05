import { handleActions } from 'redux-actions'

import {
  removeTrackedRegatta,
  updateLastWindCourse,
  updateLastWindSpeed,
  updateStartedAt,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
  updateValidGpsFixCount,
} from 'actions/locations'
import { updateStartAutoCourseStatus, updateTrackingStartTimeUpdateFlag } from 'actions/tracking'
import { distanceInM } from 'helpers/physics'
import { itemUpdateHandler } from 'helpers/reducers'
import { PositionFix } from 'models'
import { isPositionFix } from 'models/PositionFix'
import { LocationTrackingState } from './config'


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
      const optionals = {
        ...(gpsFix.accuracy && { locationAccuracy: gpsFix.accuracy }),
        ...(gpsFix.speedInKnots && gpsFix.speedInKnots > -1 && { speedInKnots: gpsFix.speedInKnots }),
        ...(gpsFix.bearingInDeg && gpsFix.bearingInDeg > -1 && { headingInDeg: gpsFix.bearingInDeg }),
      }

      return ({
        ...state,
        ...optionals,
        distance,
        lastLatitude: gpsFix.latitude,
        lastLongitude: gpsFix.longitude,
      })
    },
  },
  initialState,
)

export default reducer
