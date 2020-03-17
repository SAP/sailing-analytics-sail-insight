import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'
import * as DeepLinking from 'integrations/DeepLinking'
import { createCheckInUrlFromParams } from 'models/CheckIn'

import { joinLinkInvitation } from './checkIn'


export const CHECK_IN_URL_KEY = 'checkinUrl'

const getDeepLinkAction = (linkParams: any, navigation: any) => {
  if (!linkParams) {
    return null
  }
  if (linkParams[CHECK_IN_URL_KEY]) {
    return joinLinkInvitation(linkParams[CHECK_IN_URL_KEY], navigation)
  }
  const checkInUrl = createCheckInUrlFromParams(linkParams)
  if (checkInUrl) {
    return joinLinkInvitation(checkInUrl, navigation)
  }
  return null
}

export const performDeepLink = (linkParams: any, navigation: any) => (dispatch: DispatchType) => {
  const deepLinkAction = getDeepLinkAction(linkParams, navigation)
  return deepLinkAction && dispatch(deepLinkAction)
}

export const handleAppStartDeepLink = (navigation: any) => async (dispatch: DispatchType) => {
  try {
    const deepLinkAction = getDeepLinkAction(await DeepLinking.lastLinkParams(), navigation)
    return deepLinkAction && await dispatch(deepLinkAction)
  } catch (err) { Logger.debug(err) }
  return null
}
