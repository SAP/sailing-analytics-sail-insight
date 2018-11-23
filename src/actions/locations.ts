import { createAction } from 'redux-actions'

import { dataApi } from 'api'
import { currentTimestampAsText } from 'helpers/date'
import Logger from 'helpers/Logger'
import { DispatchType, GetStateType } from 'helpers/types'
import { PositionFix } from 'models'
import { isValidPositionFix } from 'models/PositionFix'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getBulkGpsSetting } from 'selectors/settings'
import * as CheckInService from 'services/CheckInService'
import * as GpsFixService from 'services/GPSFixService'
import * as LocationService from 'services/LocationService'
import LocationTrackingException from 'services/LocationService/LocationTrackingException'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')
export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const updateTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')
export const updateUnsentGpsFixCount = createAction('UPDATE_UNSENT_GPS_FIX_COUNT')
export const updateTrackingStatistics = createAction('UPDATE_TRACKING_STATISTICS')
export const updateLocationAccuracy = createAction('UPDATE_LOCATION_ACCURACY')
export const updateSpeedInKnots = createAction('UPDATE_SPEED_IN_KNOTS')
export const updateStartedAt = createAction('UPDATE_STARTED_AT')
export const updateHeadingInDeg = createAction('UPDATE_HEADING_IN_DEG')
export const updateDistance = createAction('UPDATE_DISTANCE')
export const updateLastWindCourse = createAction('UPDATE_WIND_COURSE')
export const updateLastWindSpeed = createAction('UPDATE_WIND_SPEED')

const sendGpsFix = async (serverUrl: string, postBody: any) => {
  try {
    const result = await dataApi(serverUrl).sendGpsFixes(postBody)
    Logger.debug('GPS-Fix-Result: ', result)
    return true
  } catch (err) {
    Logger.debug(err)
    return false
  }
}


export const startLocationUpdates = (
  leaderboardName: string,
  eventId?: string,
) => async (dispatch: DispatchType) => {
  try {
    await dispatch(updateTrackedRegatta({
      leaderboardName,
      eventId,
    }))
    await LocationService.start()
    await LocationService.changePace(true)
    GpsFixService.startPeriodicalGPSFixUpdates()
    dispatch(updateStartedAt(currentTimestampAsText()))
  } catch (err) {
    Logger.debug(err)
    dispatch(removeTrackedRegatta())
  }
}

export const stopLocationUpdates = () => async (dispatch: DispatchType) => {
  await LocationService.changePace(false)
  await LocationService.stop()
  GpsFixService.stopGPSFixUpdatesWhenSynced()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (gpsFix: PositionFix) => async (dispatch: DispatchType, getState: GetStateType) => {
  if (!gpsFix) {
    return
  }
  const state = getState()
  const serverUrl = getTrackedCheckInBaseUrl(state)
  if (!serverUrl) {
    throw new LocationTrackingException('missing event baseUrl')
  }
  if (!isValidPositionFix(gpsFix)) {
    throw new LocationTrackingException('gps fix is invalid', gpsFix)
  }
  const postData = CheckInService.gpsFixPostData([gpsFix])
  if (!postData) {
    throw new LocationTrackingException('gpsFix creation failed')
  }
  if (getBulkGpsSetting(state) || !(await sendGpsFix(serverUrl, postData))) {
    GpsFixService.storeGPSFix(serverUrl, gpsFix)
  }
  await dispatch(updateUnsentGpsFixCount(GpsFixService.unsentGpsFixCount()))
  await dispatch(updateTrackingStatistics(gpsFix))
}

export const initLocationUpdates = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}

