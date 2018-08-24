import Logger from 'helpers/Logger'
import { Dispatch } from 'helpers/types'
import * as DeepLinking from 'integrations/DeepLinking'
import { checkIn } from './checkIn'

const CHECK_IN_URL_KEY = 'checkin_url'

const getDeepLinkAction = (linkParams: any, options = {}) => {
  if (!linkParams) {
    return null
  }
  if (linkParams[CHECK_IN_URL_KEY]) {
    return checkIn(linkParams[CHECK_IN_URL_KEY])
  }
  // TODO: handle linkParams based on data
  return null
}

export const performDeepLink = (linkParams: any) => (dispatch: Dispatch) => {
  const deepLinkAction = getDeepLinkAction(linkParams)
  return deepLinkAction && dispatch(deepLinkAction)
}

export const handleAppStartDeepLink = () => async (dispatch: Dispatch) => {
  try {
    const deepLinkAction = getDeepLinkAction(
      await DeepLinking.lastLinkParams(),
      { isAppStart: true },
    )
    return deepLinkAction && await dispatch(deepLinkAction)
  } catch (err) { Logger.debug(err) }
  return null
}
