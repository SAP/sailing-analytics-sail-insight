import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import Logger from 'helpers/Logger'


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

let startListener
let stopListener

const setStartListener = (listener) => { startListener = listener }
const setStopListener = (listener) => { stopListener = listener }

BackgroundGeolocation.on('start', () => {
  Logger.debug('[INFO] BackgroundGeolocation service has been started')
  if (!startListener) { return }
  startListener()
})

BackgroundGeolocation.on('stop', () => {
  Logger.debug('[INFO] BackgroundGeolocation service has been stopped')
  if (!stopListener) { return }
  stopListener()
})

const listeners = []
const handleLocation = async (location) => {
  await Promise.all(listeners.map(listener => listener(location)))
}

BackgroundGeolocation.on('stationary', async (location) => {
  Logger.debug('[INFO] BackgroundGeolocation is now in stationary', location)
  await handleLocation(location)
})


const addLocationListener = listener => listeners.push(listener)
const removeLocationListener = (listener) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

BackgroundGeolocation.on('location', (location) => {
  // handle your locations here
  // to perform long running operation on iOS
  // you need to create background task
  Logger.debug('ON_LOCATION', location)
  BackgroundGeolocation.startTask(async (taskKey) => {
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

export default {
  start: BackgroundGeolocation.start,
  stop: BackgroundGeolocation.stop,
  addLocationListener,
  removeLocationListener,
  setStartListener,
  setStopListener,
}
