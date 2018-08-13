import BackgroundTimer from 'react-native-background-timer'

const listeners: any[] = []

const addTaskListener = (listener: () => void) => listeners.push(listener)
const removeTaskListener = (listener: () => void) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}


const handleTimerEvent = async () => {
  await Promise.all(listeners.map(listener => listener()))
}

const startBackgroundTimer = (interval: number) => BackgroundTimer.runBackgroundTimer(handleTimerEvent)
const stopBackgroundTimer = () => BackgroundTimer.stopBackgroundTimer()

export default {
  addTaskListener,
  removeTaskListener,
  startBackgroundTimer,
  stopBackgroundTimer,
}
