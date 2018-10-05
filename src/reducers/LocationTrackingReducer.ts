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
} from 'actions/locations'
import { distanceInM } from 'helpers/physics'
import { itemUpdateHandler } from 'helpers/reducers'
import { PositionFix } from 'models'
import { isPositionFix } from 'models/PositionFix'

import {  LocationTrackingReducerKeys as Keys } from './config'


const initialState = {
  [Keys.STATUS_KEY]: null,
  [Keys.LEADERBOARD_NAME_KEY]: null,
  [Keys.EVENT_ID_KEY]: null,
  [Keys.UNSENT_GPS_FIXES_KEY]: null,
  [Keys.LOCATION_ACCURACY_KEY]: null,
  [Keys.SPEED_IN_KNOTS_KEY]: null,
  [Keys.START_AT_KEY]: null,
  [Keys.HEADING_IN_DEG_KEY]: null,
  [Keys.DISTANCE_KEY]: 0,
  [Keys.LAST_LATITUDE_KEY]: null,
  [Keys.LAST_LONGITUDE_KEY]: null,
  [Keys.LAST_WIND_DIRECTION]: null,
  [Keys.LAST_WIND_SPEED_IN_KNOTS]: null,
}

const reducer = handleActions(
  {
    [updateTrackingStatus as any]: itemUpdateHandler(Keys.STATUS_KEY),
    [updateTrackedLeaderboard as any]: itemUpdateHandler(Keys.LEADERBOARD_NAME_KEY),
    [updateTrackedEventId as any]: itemUpdateHandler(Keys.EVENT_ID_KEY),
    [updateUnsentGpsFixCount as any]: itemUpdateHandler(Keys.UNSENT_GPS_FIXES_KEY),
    [updateLastWindCourse as any]: itemUpdateHandler(Keys.LAST_WIND_DIRECTION),
    [updateLastWindSpeed as any]: itemUpdateHandler(Keys.LAST_WIND_SPEED_IN_KNOTS),
    [updateStartedAt as any]: itemUpdateHandler(Keys.START_AT_KEY),
    [updateTrackedRegatta as any]: (state: any = {}, action: any) =>
      !action || !action.payload ?
        state :
        ({
          ...state,
          [Keys.EVENT_ID_KEY]: action.payload.eventId,
          [Keys.LEADERBOARD_NAME_KEY]: action.payload.leaderboardName,
          [Keys.UNSENT_GPS_FIXES_KEY]: null,
          [Keys.LOCATION_ACCURACY_KEY]: null,
        }),
    [removeTrackedRegatta as any]: (state: any = {}) => ({
      ...state,
      [Keys.STATUS_KEY]: state.status,
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
        ...(gpsFix.accuracy && { [Keys.LOCATION_ACCURACY_KEY]: gpsFix.accuracy }),
        ...(gpsFix.speedInKnots && gpsFix.speedInKnots > -1 && { [Keys.SPEED_IN_KNOTS_KEY]: gpsFix.speedInKnots }),
        ...(gpsFix.bearingInDeg && gpsFix.bearingInDeg > -1 && { [Keys.HEADING_IN_DEG_KEY]: gpsFix.bearingInDeg }),
      }

      return ({
        ...state,
        ...optionals,
        [Keys.DISTANCE_KEY]: distance,
        [Keys.LAST_LATITUDE_KEY]: gpsFix.latitude,
        [Keys.LAST_LONGITUDE_KEY]: gpsFix.longitude,
      })
    },
  },
  initialState,
)

export default reducer
