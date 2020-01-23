import branch from 'react-native-branch'

import Logger from 'helpers/Logger'
import { DeepLinkListenerType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'


const listeners: DeepLinkListenerType[] = []

const handleEvent = ({ error, params }: any) => {
  if (error) {
    Logger.debug(`Error from Branch.io: ${error}`)
    return
  }
  Logger.debug('Branch.io:', params)
  listeners.forEach(listener => listener(params))
}

export const initialize = () => {
  branch.skipCachedEvents()
  branch.subscribe(handleEvent)
}

export const addListener = (listener: DeepLinkListenerType) => listeners.push(listener)
export const removeListener = (listener: DeepLinkListenerType) => {
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    listeners.splice(index, 1)
  }
}

export const lastLinkParams = branch.getLatestReferringParams
export const installLinkParams = branch.getFirstReferringParams


// sharing

export interface SharingData {
  title: string,
  contentDescription: string,
  contentImageUrl?: string,
  contentMetadata?: {customMetadata: any},
}

export interface ShareOptions {
  messageHeader: string,
  messageBody: string,
}

export interface Shareable {
  branchUniversalObject: any,
  linkProperties: any,
  shareOptions: any,
  controlParams?: any
}

export const createSharingData = async (data: SharingData, shareOptions: ShareOptions, controlParams: any) => {

  const branchUniversalObject = await branch.createBranchUniversalObject(
    getSharingUuid(),
    data,
  )

  const linkProperties = { feature: 'share' }

  return {
    branchUniversalObject,
    linkProperties,
    shareOptions,
    controlParams
  }
}

export const showShareSheet = async (sharingData: Shareable) => {
  const { branchUniversalObject, shareOptions, linkProperties, controlParams } = sharingData
  if (!branchUniversalObject) {
    return
  }

  const { completed, error } = await branchUniversalObject.showShareSheet(
    shareOptions,
    linkProperties,
    controlParams
  )
  if (error) {
    Logger.debug('Share session error:', error)
  }
  if (completed) {
    branchUniversalObject.release()
  }
}
