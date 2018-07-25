import branch from 'react-native-branch'

import Logger from 'helpers/Logger'


const listeners = []

const handleEvent = ({ error, params }) => {
  if (error) {
    Logger.debug(`Error from Branch.io: ${error}`)
    return
  }
  Logger.debug('Branch.io:', params)
  listeners.forEach(listener => listener(params))
}

export const initialize = () => branch.subscribe(handleEvent)

export const addListener = listener => listeners.push(listener)
export const removeListener = (listener) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

export const lastLinkParams = branch.getLatestReferringParams
export const installLinkParams = branch.getFirstReferringParams
