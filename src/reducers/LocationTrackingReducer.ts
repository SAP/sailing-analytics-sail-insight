import { handleActions } from 'redux-actions'

import {
  removeTrackedRegatta,
  updateStartedAt,
  updateTrackedEventId,
  updateTrackedLeaderboard,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
} from 'actions/locations'
import { distanceInM } from 'helpers/physics'
import { GPSFix } from 'models'
import {
  DISTANCE_KEY,
  EVENT_ID_KEY,
  HEADING_IN_DEG_KEY,
  LAST_LATITUDE_KEY,
  LAST_LONGITUDE_KEY,
  LEADERBOARD_NAME_KEY,
  LOCATION_ACCURACY_KEY,
  SPEED_IN_KNOTS_KEY,
  START_AT_KEY,
  STATUS_KEY,
  UNSENT_GPS_FIXES_KEY,
} from './config'


const initialState = {
  [STATUS_KEY]: null,
  [LEADERBOARD_NAME_KEY]: null,
  [EVENT_ID_KEY]: null,
  [UNSENT_GPS_FIXES_KEY]: null,
  [LOCATION_ACCURACY_KEY]: null,
  [SPEED_IN_KNOTS_KEY]: null,
  [START_AT_KEY]: null,
  [HEADING_IN_DEG_KEY]: null,
  [DISTANCE_KEY]: 0,
  [LAST_LATITUDE_KEY]: null,
  [LAST_LONGITUDE_KEY]: null,
}

const itemUpdateHandler = (itemKey: string) => (state: any = {}, action: any) => ({
  ...state,
  [itemKey]: action && action.payload,
})

const reducer = handleActions(
  {
    [updateTrackingStatus as any]: itemUpdateHandler(STATUS_KEY),
    [updateTrackedLeaderboard as any]: itemUpdateHandler(LEADERBOARD_NAME_KEY),
    [updateTrackedEventId as any]: itemUpdateHandler(EVENT_ID_KEY),
    [updateUnsentGpsFixCount as any]: itemUpdateHandler(UNSENT_GPS_FIXES_KEY),
    [updateStartedAt as any]: itemUpdateHandler(START_AT_KEY),
    [updateTrackedRegatta as any]: (state: any = {}, action: any) =>
      !action || !action.payload ?
        state :
        ({
          ...state,
          [EVENT_ID_KEY]: action.payload.eventId,
          [LEADERBOARD_NAME_KEY]: action.payload.leaderboardName,
          [UNSENT_GPS_FIXES_KEY]: null,
          [LOCATION_ACCURACY_KEY]: null,
        }),
    [removeTrackedRegatta as any]: (state: any = {}) => ({
      ...state,
      [STATUS_KEY]: state.status,
      ...initialState,
    }),
    [updateTrackingStatistics as any]: (state: any = {}, action: any = {}) => {
      let gpsFix: GPSFix
      if (!(action.payload instanceof GPSFix)) {
        return state
      }
      gpsFix = action.payload

      const { lastLatitude, lastLongitude } = state
      const distance = !lastLatitude || !lastLongitude ?
        state.distance :
        state.distance + distanceInM(lastLatitude, lastLongitude, gpsFix.latitude, gpsFix.longitude)
      const optionals = {
        ...(gpsFix.accuracy && { [LOCATION_ACCURACY_KEY]: gpsFix.accuracy }),
        ...(gpsFix.speedInKnots && gpsFix.speedInKnots > -1 && { [SPEED_IN_KNOTS_KEY]: gpsFix.speedInKnots }),
        ...(gpsFix.bearingInDeg && gpsFix.bearingInDeg > -1 && { [HEADING_IN_DEG_KEY]: gpsFix.bearingInDeg }),
      }

      return ({
        ...state,
        ...optionals,
        [DISTANCE_KEY]: distance,
        [LAST_LATITUDE_KEY]: gpsFix.latitude,
        [LAST_LONGITUDE_KEY]: gpsFix.longitude,
      })
    },
  },
  initialState,
)

export default reducer
