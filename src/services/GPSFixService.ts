import { dataApi as api } from 'api'
import { chunk, keys  } from 'lodash'
import { PositionFix } from 'models'

import BackgroundTimer from 'react-native-background-timer'
import { deleteGPSFixRequests, readGPSFixRequests, writeGPSFixRequest } from 'storage'
import { BASE_URL_PROPERTY_NAME, GPS_FIX_PROPERTY_NAME } from 'storage/schemas'
import { updateUnsentGpsFixCount } from '../actions/locationTrackingData'
import { handleManeuverChange } from '../actions/sessions'
import Logger from '../helpers/Logger'
import { DispatchType } from '../helpers/types'
import * as CheckInService from './CheckInService'


export const DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS = 1000
export const BULK_UPDATE_TIME_INTERVAL_IN_MILLIS = 30000

let syncInProgress = false
let syncIsShuttingDown = false

const transferFixes = async (dispatch: DispatchType, backgroundTransfer: boolean) => {
  const allFixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })
  const urls: { [url: string]: any[]; } = {}

  if (allFixRequests.length === 0) {
    return
  }
  const fixRequestsChunks = chunk(allFixRequests, 20)
  if (fixRequestsChunks.length === 0) {
    return
  }

  const fixRequests = fixRequestsChunks[0]

  fixRequests.forEach((fixRequest: any) => {
    const baseUrl = fixRequest[BASE_URL_PROPERTY_NAME]
    if (!urls[baseUrl]) {
      urls[baseUrl] = []
    }
    urls[baseUrl].push(fixRequest[GPS_FIX_PROPERTY_NAME])
  })

  await Promise.all(keys(urls).map(async (url: string) => {
    const postData = CheckInService.gpsFixPostData(urls[url])
    const maneuverInfo = await api(url).sendGpsFixes(postData)

    if ((backgroundTransfer && !syncIsShuttingDown) || (!backgroundTransfer)) {
      // Prevent event and delete overlapping, when stopping background timer
      // This is generally handled by syncInProgress state
      deleteGPSFixRequests(fixRequests)
    }
    if (backgroundTransfer && !syncIsShuttingDown) {
      dispatch(handleManeuverChange(maneuverInfo))
    }
    dispatch(updateUnsentGpsFixCount(unsentGpsFixCount()))
  }))
}

export const backgroundSyncFixes = async (dispatch: DispatchType) => {
  if (syncInProgress) {
    Logger.debug('syncInProgress...............')
    return
  }
  try {
    syncInProgress = true
    await transferFixes(dispatch, true)
  } catch (err) {
    Logger.debug('Error while sendGpsFixes', err)
  } finally {
    syncInProgress = false
  }
}

export const syncAllFixes = async (dispatch: DispatchType) => {
  while (unsentGpsFixCount() > 0) {
    await transferFixes(dispatch, false)
  }
}

export const storeGPSFix = (serverUrl: string, gpsFix: PositionFix) =>
  serverUrl && gpsFix && writeGPSFixRequest(serverUrl, gpsFix)

export const unsentGpsFixCount = () => {
  const fixes = readGPSFixRequests()
  if (!fixes) {
    return 0
  }
  return fixes.length
}

export const startPeriodicalGPSFixUpdates = (bulkTransfer: boolean, dispatch: DispatchType) => {
  Logger.debug('[GPS-Fix] Transfer Manager started')
  syncInProgress = false
  syncIsShuttingDown = false
  const interval = bulkTransfer ? BULK_UPDATE_TIME_INTERVAL_IN_MILLIS : DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS
  const callback = () => backgroundSyncFixes(dispatch)
  BackgroundTimer.runBackgroundTimer(callback, interval)
}

export const stopGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Transfer Manager stopped')
  syncIsShuttingDown = true
  BackgroundTimer.stopBackgroundTimer()
}
