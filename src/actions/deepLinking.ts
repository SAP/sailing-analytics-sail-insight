import Logger from 'helpers/Logger'
import * as DeepLinking from 'integrations/DeepLinking'


const getDeepLinkAction = (linkParams: any, options = {}) => {
  if (!linkParams) {
    return null
  }
  // TODO: handle linkParams based on data
  return null
}

export const performDeepLink = (linkParams: any) => (dispatch: (action: any) => void) => {
  const deepLinkAction = getDeepLinkAction(linkParams)
  return deepLinkAction && dispatch(deepLinkAction)
}

export const handleAppStartDeepLink = () => async (dispatch: (action: any) => void) => {
  try {
    const deepLinkAction = getDeepLinkAction(
      await DeepLinking.lastLinkParams(),
      { isAppStart: true },
    )
    return deepLinkAction && await dispatch(deepLinkAction)
  } catch (err) { Logger.debug(err) }
  return null
}
