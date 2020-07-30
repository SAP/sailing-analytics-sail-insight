import BackgroundGeolocation, { Config } from 'react-native-background-geolocation-android'

import { DEV_MODE, isPlatformAndroid } from 'environment'
import { getNowAsMillis, getTimestampAsMillis } from 'helpers/date'
import { metersPerSecondsToKnots } from 'helpers/physics'
import { PositionFix } from 'models'
import I18n from '../../i18n'
import { getAccessToken } from 'selectors/auth'
import { getDeviceId } from 'selectors/user'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getStore } from 'store'
import { getDataApiGenerator } from 'api/config'
import { keepCommunicationAlive } from 'actions/communications'

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
  stopOnTerminate: false,
  isMoving: true,
  heartbeatInterval: 1, // in seconds
  disableStopDetection: true,
  pausesLocationUpdatesAutomatically: false,
  stopOnStationary: false,
  foregroundService: true,
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
  batchSync: true,
  maxBatchSize: 30,
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

export const start = (verboseLogging?: boolean) => new Promise<any>((resolve, reject) => {
  const endpoint = getDataApiGenerator(getTrackedCheckInBaseUrl(getStore().getState()))('/gps_fixes')({})

  BackgroundGeolocation.ready(
    {
      ...config,
      url: endpoint,
      authorization: {
        strategy: 'JWT',
        accessToken: getAccessToken(getStore().getState())
      },
      httpRootProperty: 'fixes',
      locationTemplate: '{"latitude": <%= latitude %>, "longitude": <%= longitude %>, "timestamp-iso": "<%= timestamp %>", "speed": <%= speed %>, "course": <%= heading %>, "accuracy": <%= accuracy %>}',
      params: {
        deviceUuid: getDeviceId()
      },
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
