import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'
import * as DeepLinking from 'integrations/DeepLinking'
import { createCheckInUrlFromParams } from 'models/CheckIn'

import { joinSessionInvitation } from './checkIn'


export const CHECK_IN_URL_KEY = 'checkinUrl'

const getDeepLinkAction = (linkParams: any) => {
  if (!linkParams) {
    return null
  }
  if (linkParams[CHECK_IN_URL_KEY]) {
    return joinSessionInvitation(linkParams[CHECK_IN_URL_KEY])
  }
  const checkInUrl = createCheckInUrlFromParams(linkParams)
  if (checkInUrl) {
    return joinSessionInvitation(checkInUrl)
  }
  return null
}

export const performDeepLink = (linkParams: any) => (dispatch: DispatchType) => {
  const deepLinkAction = getDeepLinkAction(linkParams)
  return deepLinkAction && dispatch(deepLinkAction)
}

export const handleAppStartDeepLink = () => async (dispatch: DispatchType) => {
  try {
    const deepLinkAction = getDeepLinkAction(await DeepLinking.lastLinkParams())
    return deepLinkAction && await dispatch(deepLinkAction)
  } catch (err) { Logger.debug(err) }
  return null
}
