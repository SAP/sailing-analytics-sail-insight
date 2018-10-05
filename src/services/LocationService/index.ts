import moment from 'moment'
import BackgroundGeolocation from 'react-native-background-geolocation'

import { isPlatformAndroid } from 'helpers/environment'
import Logger from 'helpers/Logger'
import { metersPerSecondsToKnots } from 'helpers/physics'
import { PositionFix } from 'models'


const LOG_TAG = '[BG_LOCATION]'
const HEARTBEAT_KEY = 'heartbeat'
const STATUS_KEY = 'enabledchange'
const MOTION_CHANGE_KEY = 'enabledchange'
const LOCATION_KEY = 'location'

const config = {
  reset: true,
  desiredAccuracy: isPlatformAndroid ?
    BackgroundGeolocation.DESIRED_ACCURACY_HIGH :
    BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
  distanceFilter: 2,
  stopOnTerminate: false,
  heartbeatInterval: 15, // in seconds
  stopOnStillActivity: false,
  // debug
  debug: false,
  // debug: __DEV__,
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  logMaxDays: 2,
  // iOS:
  locationAuthorizationRequest: 'Always',
  stationaryRadius: 2,
  preventSuspend: true,
  // Android:
  allowIdenticalLocations: true,
  // notificationTitle: 'Background tracking',
  // notificationText: 'enabled',
  interval: 2000,
  fastestInterval: 2000,
  activitiesInterval: 5000,
}

const locationListeners: any[] = []

const Log = (...args: any[]) => Logger.debug(LOG_TAG, ...args)

BackgroundGeolocation.on(STATUS_KEY, (state: any) => Log(state.enabled ? 'Started.' : 'Stopped'))

BackgroundGeolocation.on(MOTION_CHANGE_KEY, async (status: any) => {
  Log('Motion change:', status)
})

BackgroundGeolocation.on(LOCATION_KEY, async (location: any) => {
  Log('ON_LOCATION', location)
  await handleLocation(location)
})

BackgroundGeolocation.on(HEARTBEAT_KEY, (params: any) => Log('Heartbeat', params))

const handleLocation = async (location: any = {}) => {
  const { coords, timestamp } = location
  if (!coords) {
    return
  }

  const momentTime = timestamp ? moment(timestamp) : moment()
  const gpsFix: PositionFix = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    timeMillis: momentTime.valueOf(),
    speedInKnots: metersPerSecondsToKnots(coords.speed),
    bearingInDeg: coords.heading,
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

export const start = () => new Promise<any>((resolve, reject) => {
  BackgroundGeolocation.ready(
    config,
    (state: any) => {
      if (!state.enabled) {
        return BackgroundGeolocation.start(resolve, reject)
      }
      return reject(state)
    },
    reject,
    )
})

export const stop = () => new Promise<any>((resolve, reject) => BackgroundGeolocation.stop(
  resolve,
  reject,
))

export const addHeartbeatListener = (listener: (status: any) => void) =>
  BackgroundGeolocation.on(HEARTBEAT_KEY, listener)

export const removeHeartbeatListener = (listener: (enabled: boolean) => void) =>
  BackgroundGeolocation.un(HEARTBEAT_KEY, listener)

export const changePace = (enabled: boolean) => BackgroundGeolocation.changePace(enabled)
