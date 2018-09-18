import moment from 'moment'
import { createAction } from 'redux-actions'

import api from 'api'
import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'
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
export const updateTrackingStatistics = createAction('UPDATE_TRACKING_STATISTICS')
export const updateLocationAccuracy = createAction('UPDATE_LOCATION_ACCURACY')
export const updateSpeedInKnots = createAction('UPDATE_SPEED_IN_KNOTS')
export const updateStartedAt = createAction('UPDATE_STARTED_AT')
export const updateHeadingInDeg = createAction('UPDATE_HEADING_IN_DEG')
export const updateDistance = createAction('UPDATE_DISTANCE')

export const startLocationTracking = (
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
    dispatch(updateStartedAt(moment().utc().format()))
  } catch (err) {
    Logger.debug(err)
    dispatch(removeTrackedRegatta())
  }
}

export const stopLocationTracking = () => async (dispatch: DispatchType) => {
  await LocationService.changePace(false)
  await LocationService.stop()
  GpsFixService.stopGPSFixUpdatesWhenSynced()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (gpsFix: GPSFix) => async (dispatch: DispatchType, getState: () => any) => {
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
  await dispatch(updateTrackingStatistics(gpsFix))
}

export const initLocationTracking = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}
