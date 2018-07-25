import * as DeepLinking from 'integrations/DeepLinking'
import Logger from 'helpers/Logger'


const getDeepLinkAction = (linkParams, options = {}) => {
  if (!linkParams) {
    return null
  }
  // TODO: handle linkParams based on data
  return null
}

export const performDeepLink = linkParams => (dispatch) => {
  const deepLinkAction = getDeepLinkAction(linkParams)
  return deepLinkAction && dispatch(deepLinkAction)
}

export const handleAppStartDeepLink = () => async (dispatch) => {
  try {
    const deepLinkAction = getDeepLinkAction(
      await DeepLinking.lastLinkParams(),
      { isAppStart: true },
    )
    return deepLinkAction && await dispatch(deepLinkAction)
  } catch (err) { Logger.debug(err) }
  return null
}
