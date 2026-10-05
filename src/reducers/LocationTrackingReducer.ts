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


// Anything faster than this between two updates is a GPS jump (e.g. from a stale
// first fix to the real position), not sailing.
export const MAX_PLAUSIBLE_SPEED_IN_KNOTS = 60
const MAX_PLAUSIBLE_SPEED_IN_MPS = MAX_PLAUSIBLE_SPEED_IN_KNOTS / 1.94384

// The plugin odometer adds every segment between accepted fixes, including
// jumps. Returns the total of such jump segments seen so far, so that
// distance = odometer - offset ignores them.
export const nextOdometerOffset = (
  state: { lastOdometer?: number | null, lastFixTimeMillis?: number | null, odometerOffset?: number },
  odometer: number | undefined,
  timeMillis: number,
) => {
  const offset = state.odometerOffset || 0
  if (typeof odometer !== 'number' || typeof state.lastOdometer !== 'number') {
    return offset
  }
  const delta = odometer - state.lastOdometer
  if (delta < 0) {
    // odometer was reset
    return 0
  }
  const seconds = Math.max(1, (timeMillis - (state.lastFixTimeMillis || timeMillis)) / 1000)
  return delta / seconds > MAX_PLAUSIBLE_SPEED_IN_MPS ? offset + delta : offset
}

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
    // Reset everything except status and context — the tracking service
    // lifecycle owns those; checking out of a regatta must not fake a stop.
    [removeTrackedRegatta as any]: (state: any = {}) => ({
      ...initialState,
      status: state.status,
      context: state.context,
    }),
    [updateTrackingStatistics as any]: (state: any = {}, action: any = {}) => {
      let gpsFix: PositionFix
      if (!isPositionFix(action.payload)) {
        return state
      }
      gpsFix = action.payload

      const locationAccuracy = typeof gpsFix.accuracy === 'number' ?
          gpsFix.accuracy :
          null

      const speedInKnots = typeof gpsFix.speedInKnots === 'number' && gpsFix.speedInKnots > -1 ?
          gpsFix.speedInKnots :
          null

      const headingInDeg = typeof gpsFix.bearingInDeg === 'number' && gpsFix.bearingInDeg > -1 ?
          gpsFix.bearingInDeg :
          null

      const timeMillis = typeof gpsFix.timeMillis === 'number' ? gpsFix.timeMillis : Date.now()
      const odometerOffset = nextOdometerOffset(state, gpsFix.odometer, timeMillis)

      return ({
        ...state,
        odometerOffset,
        lastOdometer: typeof gpsFix.odometer === 'number' ? gpsFix.odometer : state.lastOdometer,
        lastFixTimeMillis: timeMillis,
        locationAccuracy,
        speedInKnots,
        headingInDeg,
        distance: typeof gpsFix.odometer === 'number' ? gpsFix.odometer - odometerOffset : gpsFix.odometer,
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
