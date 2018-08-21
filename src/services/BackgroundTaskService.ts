import BackgroundTimer from 'react-native-background-timer'

const listeners: any[] = []

export const addTaskListener = (listener: () => void) => listeners.push(listener)
export const removeTaskListener = (listener: () => void) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}


const handleTimerEvent = async () => {
  await Promise.all(listeners.map(listener => listener()))
}

export const startBackgroundTimer = (interval: number) => BackgroundTimer.runBackgroundTimer(handleTimerEvent, interval)
export const stopBackgroundTimer = () => BackgroundTimer.stopBackgroundTimer()
