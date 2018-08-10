import { createAction } from 'redux-actions'

import api from 'api'
import Logger from 'helpers/Logger'
import { getTrackedEventBaseUrl } from 'selectors/checkIn'
import { gpsFixData } from 'services/CheckInService'
import GPSFixService from 'services/GPSFixService'
import LocationService, { LocationTrackingException } from 'services/LocationService'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')

export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const setTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')

export const startLocationTracking = (
  leaderboardName: string,
  eventId: string,
) => (dispatch: (action: any) => void) => {
  LocationService.start()
  dispatch(setTrackedRegatta({
    leaderboardName,
    eventId,
  }))
}

export const stopLocationTracking = () => (dispatch: (action: any) => void) => {
  LocationService.stop()
  dispatch(removeTrackedRegatta())
}

export const handleGPSLocation = (location: any) => async (dispatch: (action: any) => void, getState: () => any) => {
  // TODO: handle location
  const serverUrl = getTrackedEventBaseUrl(getState())
  if (!serverUrl) {
    throw new LocationTrackingException('missing event baseUrl')
  }
  const gpsFix = gpsFixData([location])
  Logger.debug('GPS FIX: ', gpsFix)
  if (!gpsFix) {
    throw new LocationTrackingException('gpsFix creation failed')
  }
  try {
    await api(serverUrl).sendGpsFixes(gpsFix)
  } catch (err) {
    Logger.debug(err)
    GPSFixService.storeGPSFix(serverUrl, gpsFix)
  }
}
