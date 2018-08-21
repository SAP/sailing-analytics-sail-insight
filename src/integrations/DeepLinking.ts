import branch from 'react-native-branch'

import Logger from 'helpers/Logger'
import { DeepLinkListener } from 'helpers/types'


const listeners: DeepLinkListener[] = []

const handleEvent = ({ error, params }: any) => {
  if (error) {
    Logger.debug(`Error from Branch.io: ${error}`)
    return
  }
  Logger.debug('Branch.io:', params)
  listeners.forEach(listener => listener(params))
}

export const initialize = () => branch.subscribe(handleEvent)

export const addListener = (listener: DeepLinkListener) => listeners.push(listener)
export const removeListener = (listener: DeepLinkListener) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

export const lastLinkParams = branch.getLatestReferringParams
export const installLinkParams = branch.getFirstReferringParams
