import { createAction } from 'redux-actions'

import api from 'api'
import Logger from 'helpers/Logger'
import { GPSFix } from 'models'
import { getTrackedEventBaseUrl } from 'selectors/checkIn'
import * as CheckInService from 'services/CheckInService'
import * as GPSFixService from 'services/GPSFixService'
import * as LocationService from 'services/LocationService'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')
export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const updateTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')

export const startLocationTracking = (
  leaderboardName: string,
  eventId: string,
) => async (dispatch: (action: any) => void) => {
  LocationService.start()
  GPSFixService.startPeriodicalGPSFixUpdates()
  await dispatch(updateTrackedRegatta({
    leaderboardName,
    eventId,
  }))
}

export const stopLocationTracking = () => (dispatch: (action: any) => void) => {
  LocationService.stop()
  GPSFixService.stopGPSFixUpdates()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (location: any) => async (dispatch: (action: any) => void, getState: () => any) => {
  // TODO: handle location
  const serverUrl = getTrackedEventBaseUrl(getState())
  if (!serverUrl) {
    throw new LocationService.LocationTrackingException('missing event baseUrl')
  }
  const gpsFix = new GPSFix(
    location.latitude,
    location.longitude,
    location.time,
    location.speed,
    location.bearing,
  )

  const postData = CheckInService.gpsFixPostData([gpsFix])
  Logger.debug('GPS FIX: ', postData)
  if (!postData) {
    throw new LocationService.LocationTrackingException('gpsFix creation failed')
  }
  try {
    await api(serverUrl).sendGpsFixes(postData)
  } catch (err) {
    Logger.debug(err)
    GPSFixService.storeGPSFix(serverUrl, gpsFix)
  }
}
