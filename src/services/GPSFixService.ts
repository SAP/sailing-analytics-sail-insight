import { dataApi as api } from 'api'
import { keys } from 'lodash'
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

let stopWhenSynced = false

export const syncFixes = async (dispatch: DispatchType) => {
  const fixRequests = readGPSFixRequests({ sortedBy: BASE_URL_PROPERTY_NAME })
  const urls: { [url: string]: any[]; } = {}

  fixRequests.forEach((fixRequest: any) => {
    const baseUrl = fixRequest[BASE_URL_PROPERTY_NAME]
    if (!urls[baseUrl]) {
      urls[baseUrl] = []
    }
    urls[baseUrl].push(fixRequest[GPS_FIX_PROPERTY_NAME])
  })

  Logger.debug('syncFixes', fixRequests)
  await Promise.all(keys(urls).map(async (url: string) => {
    const postData = CheckInService.gpsFixPostData(urls[url])
    try {
      let maneuverInfo
      try {
        maneuverInfo = await api(url).sendGpsFixes(postData)
        deleteGPSFixRequests(fixRequests)
      } catch (err) {
        Logger.error('Error while sendGpsFixes', err)
      } finally {
        dispatch(handleManeuverChange(maneuverInfo))
        dispatch(updateUnsentGpsFixCount(unsentGpsFixCount()))
      }
    } catch (err) {
      Logger.error('Error during syncFixes', err)
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

export const startPeriodicalGPSFixUpdates = (bulkTransfer: boolean, dispatch: DispatchType) => {
  Logger.debug('[GPS-Fix] Transfer Manager started')
  stopWhenSynced = false
  const interval = bulkTransfer ? BULK_UPDATE_TIME_INTERVAL_IN_MILLIS : DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS
  const callback = () => syncFixes(dispatch)
  BackgroundTimer.runBackgroundTimer(callback, interval)
}

export const stopGPSFixUpdates = () => {
  Logger.debug('[GPS-Fix] Transfer Manager stopped')
  BackgroundTimer.stopBackgroundTimer()
}

export const stopGPSFixUpdatesWhenSynced = () => {
  const count = unsentGpsFixCount()
  if (count > 0) {
    stopWhenSynced = true
    return
  }
  stopGPSFixUpdates()
}
