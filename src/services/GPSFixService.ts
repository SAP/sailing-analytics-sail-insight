import { keys } from 'lodash'

import { dataApi as api } from 'api'
import Logger from 'helpers/Logger'
import { PositionFix } from 'models'
import { deleteGPSFixRequests, readGPSFixRequests, writeGPSFixRequest } from 'storage'
import { BASE_URL_PROPERTY_NAME, GPS_FIX_PROPERTY_NAME } from 'storage/schemas'

import * as BackgroundTaskService from './BackgroundTaskService'
import * as CheckInService from './CheckInService'
// import * as LocationService from './LocationService'


export const UPDATE_TIME_INTERVAL_IN_MILLIS = 30000

let stopWhenSynced = false

export const syncFixes = async () => {
  const fixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })
  const urls: { [url: string]: any[]; } = {}

  fixRequests.forEach((fixRequest: any) => {
    const baseUrl = fixRequest[BASE_URL_PROPERTY_NAME]
    if (!urls[baseUrl]) {
      urls[baseUrl] = []
    }
    urls[baseUrl].push(fixRequest[GPS_FIX_PROPERTY_NAME])
  })

  await Promise.all(keys(urls).map(async (url: string) => {
    const postData = CheckInService.gpsFixPostData(urls[url])
    try {
      await api(url).sendGpsFixes(postData)
      deleteGPSFixRequests(fixRequests)
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

export const startPeriodicalGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Offline Manager started')
  BackgroundTaskService.startBackgroundTimer(UPDATE_TIME_INTERVAL_IN_MILLIS)
  BackgroundTaskService.addTaskListener(syncFixes)
  // LocationService.addHeartbeatListener(onTask)
}

export const stopGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Offline Manager stopped')
  BackgroundTaskService.removeTaskListener(syncFixes)
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
