import { handleActions } from 'redux-actions'

import { distanceInM } from 'helpers/physics'
import { itemUpdateHandler } from 'helpers/reducers'
import { PositionFix } from 'models'
import { isPositionFix } from 'models/PositionFix'
import { LocationTrackingState } from 'reducers/config'

import {
  removeTrackedRegatta, resetTrackingStatistics,
  updateLastWindCourse,
  updateLastWindSpeed,
  updateStartedAt,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateTrackingContext
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
  lastWindSpeedInKnots: null
}

const reducer = handleActions(
  {
    [updateTrackingStatus as any]: itemUpdateHandler('status'),
    [updateTrackingContext as any]: itemUpdateHandler('context'),
    [updateLastWindCourse as any]: itemUpdateHandler('lastWindCourse'),
    [updateLastWindSpeed as any]: itemUpdateHandler('lastWindSpeedInKnots'),
    [updateStartedAt as any]: itemUpdateHandler('startedAt'),
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
    [resetTrackingStatistics as any]: () =>  initialState,
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
