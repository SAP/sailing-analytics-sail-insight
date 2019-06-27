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
  updateStartedAt,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateUnsentGpsFixCount,
} from 'actions/locationTrackingData'
import { checkAndUpdateRaceSettings } from 'actions/sessionConfig'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'


export const startLocationUpdates = (
  bulkTransfer: boolean,
  leaderboardName: string,
  eventId?: string,
  verboseLogging?: boolean,
) => async (dispatch: DispatchType) => {

  try {
    if (await LocationService.isEnabled()) {
      Logger.debug('LocationService seems to be active, stop it first before continue')
      await LocationService.stop()
    }
  } catch (err) {
    Logger.debug('Error during stop for start location service', err)
  }

  try {
    await dispatch(updateTrackedRegatta({ leaderboardName, eventId }))
    await LocationService.start(verboseLogging)
    await LocationService.changePace(true)
    GpsFixService.startPeriodicalGPSFixUpdates(bulkTransfer, dispatch)
    dispatch(updateStartedAt(currentTimestampAsText()))
  } catch (err) {
    Logger.debug('Error during startLocationUpdates', err)
    // dispatch(removeTrackedRegatta())
  }
}

export const stopLocationUpdates = () => async (dispatch: DispatchType) => {
  Logger.debug('Stopping Location updates...')
  try {
    if (await LocationService.isEnabled()) {
      await LocationService.changePace(false)
      await LocationService.stop()
      GpsFixService.stopGPSFixUpdates()
      Logger.debug('Location updates stopped.')
    } else {
      Logger.debug('stopLocationUpdates already stopped.')
    }
  } catch (e) {
    Logger.debug('Error during stopping location updates', e)
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
  GpsFixService.storeGPSFix(serverUrl, gpsFix)
  dispatch(updateUnsentGpsFixCount(GpsFixService.unsentGpsFixCount()))
  dispatch(updateTrackingStatistics(gpsFix))
  dispatch(checkAndUpdateRaceSettings(gpsFix))
}

export const initLocationUpdates = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}

