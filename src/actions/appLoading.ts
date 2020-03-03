import { DispatchType } from 'helpers/types'
import { initialNavigation } from 'navigation'

import { checkCurrentAuthSession } from './auth'
import { handleAppStartDeepLink } from './deepLinking'
import { updateCreatingEvent } from './events'
import { updateLoadingCheckInFlag, updateLoadingSplashFlag } from './checkIn'

export const initializeApp = () => async (dispatch: DispatchType) => {
  /// reset flags for loading
  await dispatch(updateCreatingEvent(false))
  await dispatch(updateLoadingCheckInFlag(false))
  await dispatch(updateLoadingSplashFlag(false))
  /// reset flags for loading

  await dispatch(checkCurrentAuthSession())
  // no need to navigate to app after splash is shown, flag takes care of it
  //initialNavigation()
  await dispatch(handleAppStartDeepLink())
}
