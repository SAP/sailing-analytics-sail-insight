import BackgroundGeolocation, { Config } from 'react-native-background-geolocation-android'

import { DEV_MODE, isPlatformAndroid } from 'environment'
import { getNowAsMillis, getTimestampAsMillis } from 'helpers/date'
import Logger from 'helpers/Logger'
import { metersPerSecondsToKnots } from 'helpers/physics'
import { PositionFix } from 'models'
import I18n from '../../i18n'

const LOG_TAG = '[BG_LOCATION]'
const HEARTBEAT_KEY = 'heartbeat'
const STATUS_KEY = 'enabledchange'
// const MOTION_CHANGE_KEY = 'motionchange'
const LOCATION_KEY = 'location'

const config: Config = {
  reset: true,
  desiredAccuracy: isPlatformAndroid ?
    BackgroundGeolocation.DESIRED_ACCURACY_HIGH :
    BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
  distanceFilter: 0, // no minimum travel distance before location update to increase accuracy
  disableElasticity: true, // disable auto distanceFilter based on speed to increase accuracy
  stopOnTerminate: true, // Default: true. Set false to continue tracking after user teminates the app.
  heartbeatInterval: 1, // in seconds
  disableStopDetection: true,
  stopOnStationary: false,
  // debug
  debug: false,
  // debug: __DEV__,
  logLevel: BackgroundGeolocation.LOG_LEVEL_WARNING,
  logMaxDays: 2,
  // iOS:
  locationAuthorizationRequest: 'Always',
  showsBackgroundLocationIndicator: true,
  stationaryRadius: 1,
  preventSuspend: true,
  // Android:
  allowIdenticalLocations: true,
  locationUpdateInterval: 333,
  fastestLocationUpdateInterval: 333,
  activityRecognitionInterval: 0,
  notification: {
    text: I18n.t('text_notification_tracking'),
  },
}

const locationListeners: any[] = []

const Log = (...args: any[]) => Logger.debug(LOG_TAG, ...args)


export const registerEvents = () => {
  // BackgroundGeolocation.on(MOTION_CHANGE_KEY, async (status: any) => {
  //   Log('Motion change:', status)
  // })

  BackgroundGeolocation.on(LOCATION_KEY, async (location: any) => {
    // Log('Location:', location)
    await handleGeolocation(location)
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

export const start = (verboseLogging?: boolean) => new Promise<any>((resolve, reject) => {
  BackgroundGeolocation.ready(
    {
      ...config,
      ...(!!verboseLogging ? {
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      } : {}),
    },
    (state: any) => {
      if (!state.enabled) {
        return BackgroundGeolocation.start(resolve, reject)
      }
      return reject(state)
    },
    reject,
  )
})

export const stop = () => new Promise<any>((resolve, reject) => BackgroundGeolocation.stop(resolve, reject))

// export const addHeartbeatListener = (listener: (status: any) => void) =>
//   BackgroundGeolocation.on(HEARTBEAT_KEY, listener)
//
// export const removeHeartbeatListener = (listener: (enabled: boolean) => void) =>
//   BackgroundGeolocation.un(HEARTBEAT_KEY, listener)

export const changePace = (enabled: boolean) => BackgroundGeolocation.changePace(enabled)
