import Logger from 'helpers/Logger'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'


const LOG_TAG = '[BG_LOCATION]'

BackgroundGeolocation.configure({
  desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  stationaryRadius: 2,
  distanceFilter: 2,
  notificationTitle: 'Background tracking',
  notificationText: 'enabled',
  debug: true,
  startOnBoot: false,
  stopOnTerminate: false,
  locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
  interval: 2000,
  fastestInterval: 2000,
  activitiesInterval: 5000,
  stopOnStillActivity: false,
})

let startListener: (() => void) | null
let stopListener: (() => void) | null

export const checkStatus: () => any = () => new Promise<any>((resolve, reject) => BackgroundGeolocation.checkStatus(
  resolve,
  reject,
))

export const setStartListener = async (listener: () => void) => {
  startListener = listener
  const status = await checkStatus()
  if (!listener || !status || !status.isRunning) {
    return
  }
  listener()
}
export const setStopListener = (listener: () => void) => { stopListener = listener }
export const removeStartListener = () => { startListener = null }
export const removeStopListener = () => { stopListener = null }

BackgroundGeolocation.on('start', () => {
  Logger.debug(`${LOG_TAG} Service has been started`)
  if (!startListener) { return }
  startListener()
})

BackgroundGeolocation.on('stop', () => {
  Logger.debug(`${LOG_TAG} Service has been stopped`)
  if (!stopListener) { return }
  stopListener()
})

BackgroundGeolocation.on('error', (err: any) => {
  Logger.debug(`${LOG_TAG} [ERR]`, err)
})

const listeners: any[] = []
const handleLocation = async (location: any) => {
  await Promise.all(listeners.map(listener => listener(location)))
}

BackgroundGeolocation.on('stationary', async (location: any) => {
  Logger.debug('[INFO] BackgroundGeolocation is now in stationary', location)
  await handleLocation(location)
})


export const addLocationListener = (listener: (location: any) => void) => listeners.push(listener)
export const removeLocationListener = (listener: (location: any) => void) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

BackgroundGeolocation.on('location', (location: any) => {
  // handle your locations here
  // to perform long running operation on iOS
  // you need to create background task
  Logger.debug('ON_LOCATION', location)
  BackgroundGeolocation.startTask(async (taskKey: string) => {
    // execute long running task
    // eg. ajax post location
    // IMPORTANT: task has to be ended by endTask
    await handleLocation(location)
    BackgroundGeolocation.endTask(taskKey)
  })
})

export const LocationTrackingStatus = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
}

export class LocationTrackingException extends Error {
  public static NAME: string = 'LocationTrackingException'

  public data: any

  constructor(message: string, data?: any) {
    super(message)
    this.message = message
    this.name = LocationTrackingException.NAME
    this.data = data
  }
}

export const start = BackgroundGeolocation.start
export const stop = BackgroundGeolocation.stop
