import { dataApi } from 'api'
import { PositionFix } from 'models'
import { hasValidPosition } from 'models/PositionFix'
import * as CheckInService from 'services/CheckInService'
import * as GpsFixService from 'services/GPSFixService'
import * as LocationService from 'services/LocationService'
import LocationTrackingException from 'services/LocationService/LocationTrackingException'

import { currentTimestampAsText } from 'helpers/date'
import Logger from 'helpers/Logger'
import { DispatchType, GetStateType } from 'helpers/types'

import {
  removeTrackedRegatta,
  updateStartedAt,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
} from 'actions/locationTrackingData'
import { checkAndUpdateRaceSettings } from 'actions/sessionConfig'
import { handleManeuverChange } from 'actions/sessions'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getBulkGpsSetting } from 'selectors/settings'


const sendGpsFix = async (serverUrl: string, postBody: any, dispatch: DispatchType) => {
  let maneuverInfo
  try {
    maneuverInfo = await dataApi(serverUrl).sendGpsFixes(postBody)
    return true
  } catch (err) {
    Logger.debug(err)
    return false
  } finally {
    dispatch(handleManeuverChange(maneuverInfo))
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
  Logger.debug('Stopping Location updates...')
  if (LocationService.isEnabled()) {
    await LocationService.changePace(false)
    await LocationService.stop()
    GpsFixService.stopGPSFixUpdatesWhenSynced()
    Logger.debug('Location updates stopped.')
  } else {
    Logger.debug('stopLocationUpdates already stopped.')
  }
}

export const handleLocation = (gpsFix: PositionFix) => async (dispatch: DispatchType, getState: GetStateType) => {
  if (!gpsFix) {
    return
  }
  const state = getState()
  const serverUrl = getTrackedCheckInBaseUrl(state)
  if (!serverUrl) {
    throw new LocationTrackingException('[LOCATION] missing event baseUrl')
  }
  if (!hasValidPosition(gpsFix)) {
    throw new LocationTrackingException('gps fix is invalid', gpsFix)
  }
  const postData = CheckInService.gpsFixPostData([gpsFix])
  if (!postData) {
    throw new LocationTrackingException('gpsFix creation failed')
  }
  if (getBulkGpsSetting(state) || !(await sendGpsFix(serverUrl, postData, dispatch))) {
    GpsFixService.storeGPSFix(serverUrl, gpsFix)
  }
  await dispatch(updateUnsentGpsFixCount(GpsFixService.unsentGpsFixCount()))
  await dispatch(updateTrackingStatistics(gpsFix))
  dispatch(checkAndUpdateRaceSettings(gpsFix))
}

export const initLocationUpdates = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}

