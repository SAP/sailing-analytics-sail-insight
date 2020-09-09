import BackgroundGeolocation, { Config } from 'react-native-background-geolocation-android'

import { DEV_MODE, isPlatformAndroid } from 'environment'
import { getNowAsMillis, getTimestampAsMillis } from 'helpers/date'
import { metersPerSecondsToKnots } from 'helpers/physics'
import { PositionFix } from 'models'
import I18n from '../../i18n'
import { getAccessToken } from 'selectors/auth'
import { getDeviceId } from 'selectors/user'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getVerboseLoggingSetting } from 'selectors/settings'
import { getBulkGpsSetting } from 'selectors/settings'
import { getStore } from 'store'
import { getDataApiGenerator } from 'api/config'
import { keepCommunicationAlive } from 'actions/communications'

const HEARTBEAT_KEY = 'heartbeat'
const STATUS_KEY = 'enabledchange'
// const MOTION_CHANGE_KEY = 'motionchange'
const LOCATION_KEY = 'location'

const config: Config = {
  reset: true,
  activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER_NAVIGATION,
  desiredAccuracy: isPlatformAndroid ?
    BackgroundGeolocation.DESIRED_ACCURACY_HIGH :
    BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
  distanceFilter: 0,
  disableElasticity: true,
  stopOnTerminate: false,
  isMoving: true,
  heartbeatInterval: 1,
  disableStopDetection: true,
  pausesLocationUpdatesAutomatically: false,
  stopOnStationary: false,
  foregroundService: true,
  debug: false,
  logMaxDays: 2,
  locationAuthorizationRequest: 'Always',
  showsBackgroundLocationIndicator: true,
  stationaryRadius: 1,
  preventSuspend: true,
  batchSync: true,
  maxBatchSize: 30,
  allowIdenticalLocations: true,
  locationUpdateInterval: 333,
  fastestLocationUpdateInterval: 333,
  activityRecognitionInterval: 0,
  notification: {
    text: I18n.t('text_notification_tracking'),
  },
}

const locationListeners: any[] = []

export const registerEvents = () => {
  // BackgroundGeolocation.on(MOTION_CHANGE_KEY, async (status: any) => {
  //   Log('Motion change:', status)
  // })

  BackgroundGeolocation.on(LOCATION_KEY, async (location: any) => {
    // Log('Location:', location)
    await handleGeolocation(location)

    keepCommunicationAlive()
  })

  BackgroundGeolocation.on(HEARTBEAT_KEY, async (params: any) => {
    const location = await BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      persist: true,
      desiredAccuracy: 15,
    })

    await handleGeolocation(location)
  })
}

export const unregisterEvents = () => {
  BackgroundGeolocation.removeListeners()
}

const handleGeolocation = async (location: any = {}) => {
  const { coords, timestamp } = location
  if (!coords) {
    return
  }

  const gpsFix: PositionFix = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    timeMillis: DEV_MODE ? getNowAsMillis() : getTimestampAsMillis(timestamp),
    speedInKnots: metersPerSecondsToKnots(Math.max(0, coords.speed)),
    bearingInDeg: Math.max(0, coords.heading),
    accuracy: coords.accuracy,
  }

  await Promise.all(locationListeners.map(listener => listener && listener(gpsFix)))
}

export const isEnabled: () => any = () => new Promise<any>((resolve, reject) => BackgroundGeolocation.getState(
  (state: any) => resolve(state && state.enabled),
  reject,
))

export const addStatusListener = (listener: (status: any) => void) =>
  BackgroundGeolocation.on(STATUS_KEY, listener)

export const removeStatusListener = (listener: (enabled: boolean) => void) =>
  BackgroundGeolocation.un(STATUS_KEY, listener)

export const addLocationListener = (listener: (location: any) => void) => locationListeners.push(listener)

export const removeLocationListener = (listener: (location: any) => void) => {
  const index = locationListeners.indexOf(listener)
  if (index !== -1) {
    locationListeners.splice(index, 1)
  }
}

export const LocationTrackingStatus = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
}

export const LocationTrackingContext = {
  LOCAL: 'LOCAL',
  REMOTE: 'REMOTE'
}

export const GpsFixesThreshold = {
  NORMAL: 0,
  BATTERY_OPTIMIZED: 30
}

export const ready = () => {
  const state = getStore().getState()
  const url = getDataApiGenerator(getTrackedCheckInBaseUrl(state))('/gps_fixes')({})
  const token = getAccessToken(state)
  const verboseLogging = getVerboseLoggingSetting(state)
  const bulkSending = getBulkGpsSetting(state)

  return BackgroundGeolocation.ready(
    {
      ...config,
      url,
      autoSyncThreshold: bulkSending ? GpsFixesThreshold.BATTERY_OPTIMIZED : GpsFixesThreshold.NORMAL,
      authorization: {
        strategy: 'JWT',
        accessToken: token
      },
      httpRootProperty: 'fixes',
      locationTemplate: '{"latitude": <%= latitude %>, "longitude": <%= longitude %>, "timestamp-iso": "<%= timestamp %>", "speed": <%= speed %>, "course": <%= heading %>, "accuracy": <%= accuracy %>}',
      params: {
        deviceUuid: getDeviceId()
      },
      logLevel: verboseLogging ? BackgroundGeolocation.LOG_LEVEL_VERBOSE : BackgroundGeolocation.LOG_LEVEL_OFF
    })
}

export const setConfig = (config: any) =>
  BackgroundGeolocation.setConfig(config)

export const setAccessToken = (token: string) =>
  BackgroundGeolocation.setConfig({
    authorization: {
      strategy: 'JWT',
      accessToken: token
    },
  })

export const setVerboseLogging = (verboseLogging: boolean) =>
  BackgroundGeolocation.setConfig({
    logLevel: verboseLogging ? BackgroundGeolocation.LOG_LEVEL_VERBOSE : BackgroundGeolocation.LOG_LEVEL_OFF
  })

export const start = (verboseLogging?: boolean) => new Promise<any>((resolve, reject) =>
  BackgroundGeolocation.start(resolve, reject))

export const stop = () => new Promise<any>((resolve, reject) => BackgroundGeolocation.stop(resolve, reject))

// export const addHeartbeatListener = (listener: (status: any) => void) =>
//   BackgroundGeolocation.on(HEARTBEAT_KEY, listener)
//
// export const removeHeartbeatListener = (listener: (enabled: boolean) => void) =>
//   BackgroundGeolocation.un(HEARTBEAT_KEY, listener)

export const changePace = (enabled: boolean) => BackgroundGeolocation.changePace(enabled)
