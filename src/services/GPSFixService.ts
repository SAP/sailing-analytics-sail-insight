import { keys } from 'lodash'

import { dataApi as api } from 'api'
import Logger from 'helpers/Logger'
import { PositionFix } from 'models'
import { deleteGPSFixRequests, readGPSFixRequests, writeGPSFixRequest } from 'storage'
import { BASE_URL_PROPERTY_NAME, GPS_FIX_PROPERTY_NAME } from 'storage/schemas'
import { updateUnsentGpsFixCount } from '../actions/locationTrackingData'
import { handleManeuverChange } from '../actions/sessions'
import { DispatchType } from '../helpers/types'

import * as BackgroundTaskService from './BackgroundTaskService'
import * as CheckInService from './CheckInService'


export const DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS = 1000
export const BULK_UPDATE_TIME_INTERVAL_IN_MILLIS = 30000

let stopWhenSynced = false

export const syncFixes = async (dispatch: DispatchType) => {
  Logger.debug('syncFixes')
  const fixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })
  const urls: { [url: string]: any[]; } = {}

  fixRequests.forEach((fixRequest: any) => {
    const baseUrl = fixRequest[BASE_URL_PROPERTY_NAME]
    if (!urls[baseUrl]) {
      urls[baseUrl] = []
    }
    urls[baseUrl].push(fixRequest[GPS_FIX_PROPERTY_NAME])
  })

  Logger.debug('fixRequests', fixRequests)
  await Promise.all(keys(urls).map(async (url: string) => {
    const postData = CheckInService.gpsFixPostData(urls[url])
    Logger.debug('postData', postData)
    try {
      let maneuverInfo
      try {
        maneuverInfo = await api(url).sendGpsFixes(postData)
        deleteGPSFixRequests(fixRequests)
      } catch (err) {
        Logger.debug(err)
      } finally {
        dispatch(handleManeuverChange(maneuverInfo))
        dispatch(updateUnsentGpsFixCount(unsentGpsFixCount()))
      }
    } catch (err) {
      Logger.debug(err)
    }
  }))

  if (stopWhenSynced) {
    stopGPSFixUpdates()
  }
}

export const storeGPSFix = (serverUrl: string, gpsFix: PositionFix) =>
  serverUrl && gpsFix && writeGPSFixRequest(serverUrl, gpsFix)

export const unsentGpsFixCount = () => {
  const fixes = readGPSFixRequests()
  return fixes && fixes.length
}

let syncFixesWithDispatch: () => {}

export const startPeriodicalGPSFixUpdates = (bulkTransfer: boolean, dispatch: DispatchType) => {
  Logger.debug('[GPS-Fix] Transfer Manager started')
  stopWhenSynced = false
  BackgroundTaskService.startBackgroundTimer(bulkTransfer ? BULK_UPDATE_TIME_INTERVAL_IN_MILLIS : DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS)
  syncFixesWithDispatch  = () => syncFixes(dispatch)
  BackgroundTaskService.addTaskListener(syncFixesWithDispatch)
  // LocationService.addHeartbeatListener(onTask)
}

export const stopGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Transfer Manager stopped')
  BackgroundTaskService.removeTaskListener(syncFixesWithDispatch)
  BackgroundTaskService.stopBackgroundTimer()
  // LocationService.removeHeartbeatListener(onTask)
}

export const stopGPSFixUpdatesWhenSynced = () => {
  const count = unsentGpsFixCount()
  if (count > 0) {
    stopWhenSynced = true
    return
  }
  stopGPSFixUpdates()
}
