import api from 'api'
import { keys } from 'lodash'
import { readGPSFixRequests, writeGPSFixRequest } from 'storage'
import { BASE_URL_PROPERTY_NAME } from 'storage/schemas'
import BackgroundTaskService from './BackgroundTaskService'
import * as CheckInService from './CheckInService'

const UPDATE_TIME_INTERVAL_IN_MILLIS = 3000

const onTask = async () => {
  // TODO: get gps fix request objects and bulk send them 
  const fixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })

  console.log('STORED_REQUESTS', fixRequests)

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
    api(url).sendGpsFixes(postData)
  }))
}

export const storeGPSFix = (serverUrl: string, gpsFix: any) => writeGPSFixRequest(serverUrl, gpsFix)

export const startPeriodicalGPSFixUpdates = () => {
  BackgroundTaskService.addTaskListener(onTask)
  BackgroundTaskService.startBackgroundTimer(UPDATE_TIME_INTERVAL_IN_MILLIS)
}

export const stopGPSFixUpdates = () => {
  BackgroundTaskService.removeTaskListener(onTask)
  BackgroundTaskService.stopBackgroundTimer()
}
