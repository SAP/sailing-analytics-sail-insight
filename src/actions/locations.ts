import { PositionFix } from 'models'
import * as LocationService from 'services/LocationService'
import { currentTimestampAsText } from 'helpers/date'
import Logger from 'helpers/Logger'
import { DispatchType, GetStateType } from 'helpers/types'

import {
  updateStartedAt,
  updateTrackedRegatta,
  updateTrackingStatistics,
  updateTrackingStatus,
  updateTrackingContext
} from 'actions/locationTrackingData'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getVerboseLoggingSetting } from 'selectors/settings'
import { getTrackedEventId } from 'selectors/location'
import { getDataApiGenerator } from 'api/config'
import { getBulkGpsSetting } from 'selectors/settings'

export const startLocationUpdates = (
  leaderboardName: string,
  eventId?: string
) => async (dispatch: DispatchType, getState: GetStateType) => {

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

    const state = getState()
    const url = getDataApiGenerator(getTrackedCheckInBaseUrl(state))('/gps_fixes')({})
    const bulkSending = getBulkGpsSetting(state)
    const verboseLogging = getVerboseLoggingSetting(state)

    // Restore stopOnTerminate=false that might have been set to true
    // when tracking locally (eg: for course creator)
    await LocationService.setConfig({
      url,
      stopOnTerminate: false,
      autoSyncThreshold: bulkSending ?
        LocationService.GpsFixesThreshold.BATTERY_OPTIMIZED :
        LocationService.GpsFixesThreshold.NORMAL
    })

    await LocationService.setVerboseLogging(verboseLogging)
    await LocationService.start()
    await LocationService.changePace(true)
    await dispatch(updateStartedAt(currentTimestampAsText()))
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
      Logger.debug('Location updates stopped.')
    } else {
      Logger.debug('stopLocationUpdates already stopped.')
    }
  } catch (e) {
    Logger.debug('Error during stopping location updates', e)
  }
}

// A tracking mode where gps fixes are not sent to the server.
// Used inside course creator to get instant ping locations.
export const startLocalLocationUpdates = () => async (dispatch) => {
  if (await LocationService.isEnabled()) {
    return
  }

  // For the course creator, we want tracking to stop when the
  // app is closed.
  await LocationService.setConfig({ url: undefined, stopOnTerminate: true })
  await LocationService.start()
  await LocationService.changePace(true)
  await dispatch(updateTrackingContext(LocationService.LocationTrackingContext.LOCAL))
}

export const stopLocalLocationUpdates = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const isTrackingIntoEvent = getTrackedEventId(getState())

  if (isTrackingIntoEvent) {
    return
  }

  await LocationService.stop()
  await LocationService.changePace(false)
}

export const handleLocation = (gpsFix: PositionFix) => async (dispatch: DispatchType, getState: GetStateType) => {
  if (!gpsFix) {
    return
  }

  dispatch(updateTrackingStatistics(gpsFix))
}

export const initLocationUpdates = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED

  return dispatch(updateTrackingStatus(status))
}
