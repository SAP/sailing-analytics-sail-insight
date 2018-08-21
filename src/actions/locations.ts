import { createAction } from 'redux-actions'

import api from 'api'
import Logger from 'helpers/Logger'
import { Dispatch } from 'helpers/types'
import { GPSFix } from 'models'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import * as CheckInService from 'services/CheckInService'
import * as GPSFixService from 'services/GPSFixService'
import * as LocationService from 'services/LocationService'
import LocationTrackingException from 'services/LocationService/LocationTrackingException'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')
export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const updateTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')

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
    GPSFixService.startPeriodicalGPSFixUpdates()
  } catch (err) {
    Logger.debug(err)
    dispatch(removeTrackedRegatta())
  }
}

export const stopLocationTracking = () => async (dispatch: Dispatch) => {
  await LocationService.changePace(false)
  await LocationService.stop()
  GPSFixService.stopGPSFixUpdates()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (gpsFix: GPSFix) => async (dispatch: Dispatch, getState: () => any) => {
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
    GPSFixService.storeGPSFix(serverUrl, gpsFix)
  }
}

export const initLocationTracking = () => async (dispatch: Dispatch) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}
