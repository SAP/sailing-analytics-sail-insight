import moment from 'moment'
import { createAction } from 'redux-actions'

import api from 'api'
import Logger from 'helpers/Logger'
import { Dispatch } from 'helpers/types'
import { GPSFix } from 'models'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
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
export const updateLocationAccuracy = createAction('UPDATE_LOCATION_ACCURACY')
export const updateSpeedInKnots = createAction('UPDATE_SPEED_IN_KNOTS')
export const updateStartedAt = createAction('UPDATE_STARTED_AT')
export const updateHeadingInDeg = createAction('UPDATE_HEADING_IN_DEG')

export const startLocationTracking = (
  leaderboardName: string,
  eventId: string,
) => async (dispatch: Dispatch) => {
  try {
    await dispatch(updateTrackedRegatta({
      leaderboardName,
      eventId,
    }))
    await LocationService.start()
    await LocationService.changePace(true)
    GpsFixService.startPeriodicalGPSFixUpdates()
    dispatch(updateStartedAt(moment().utc().format()))
  } catch (err) {
    Logger.debug(err)
    dispatch(removeTrackedRegatta())
  }
}

export const stopLocationTracking = () => async (dispatch: Dispatch) => {
  await LocationService.changePace(false)
  await LocationService.stop()
  GpsFixService.stopGPSFixUpdatesWhenSynced()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (gpsFix: GPSFix) => async (dispatch: Dispatch, getState: () => any) => {
  if (!gpsFix) {
    return
  }

  const serverUrl = getTrackedCheckInBaseUrl(getState())
  if (!serverUrl) {
    throw new LocationTrackingException('missing event baseUrl')
  }
  const postData = CheckInService.gpsFixPostData([gpsFix])
  if (!postData) {
    throw new LocationTrackingException('gpsFix creation failed')
  }
  try {
    await api(serverUrl).sendGpsFixes(postData)
  } catch (err) {
    Logger.debug(err)
    GpsFixService.storeGPSFix(serverUrl, gpsFix)
  }
  await dispatch(updateUnsentGpsFixCount(GpsFixService.unsentGpsFixCount()))
  if (gpsFix.accuracy) {
    await dispatch(updateLocationAccuracy(gpsFix.accuracy))
  }
  if (gpsFix.speedInKnots && gpsFix.speedInKnots > -1) {
    await dispatch(updateSpeedInKnots(gpsFix.speedInKnots))
  }
  if (gpsFix.bearingInDeg && gpsFix.bearingInDeg > -1) {
    await dispatch(updateHeadingInDeg(gpsFix.bearingInDeg))
  }
}

export const initLocationTracking = () => async (dispatch: Dispatch) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}
