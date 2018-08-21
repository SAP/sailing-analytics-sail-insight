import api from 'api'
import Logger from 'helpers/Logger'
import { keys } from 'lodash'
import { deleteGPSFixRequests, readGPSFixRequests, writeGPSFixRequest } from 'storage'
import { BASE_URL_PROPERTY_NAME } from 'storage/schemas'
import * as BackgroundTaskService from './BackgroundTaskService'
import * as CheckInService from './CheckInService'
import * as LocationService from './LocationService'

const UPDATE_TIME_INTERVAL_IN_MILLIS = 15000

const onTask = async () => {
  const fixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })

  const urls: { [url: string]: any[]; } = {}

  fixRequests.forEach((fixRequest: any) => {
    const baseUrl = fixRequest.baseUrl
    if (!urls[baseUrl]) {
      urls[baseUrl] = []
    }
    urls[baseUrl].push(fixRequest.gpsFix)
  })

  await Promise.all(keys(urls).map(async (url: string) => {
    const postData = CheckInService.gpsFixPostData(urls[url])
    try {
      await api(url).sendGpsFixes(postData)
      deleteGPSFixRequests(urls[url])
    } catch (err) {
      Logger.debug(err)
    }
  }))
}

export const storeGPSFix = (serverUrl: string, gpsFix: any) => writeGPSFixRequest(serverUrl, gpsFix)

export const startPeriodicalGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Offline Manager started')
  // BackgroundTaskService.startBackgroundTimer(UPDATE_TIME_INTERVAL_IN_MILLIS)
  // BackgroundTaskService.addTaskListener(onTask)
  LocationService.addHeartbeatListener(onTask)
}

export const stopGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Offline Manager stopped')
  // BackgroundTaskService.removeTaskListener(onTask)
  // BackgroundTaskService.stopBackgroundTimer()
  LocationService.removeHeartbeatListener(onTask)
}
