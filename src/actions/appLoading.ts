import { DispatchType } from 'helpers/types'
import { initialNavigation } from 'navigation'

import { checkCurrentAuthSession } from './auth'
import { handleAppStartDeepLink } from './deepLinking'
import { updateCreatingEvent } from './events'
import { updateLoadingCheckInFlag } from './checkIn'


export const initializeApp = () => async (dispatch: DispatchType) => {
  /// reset flags for loading
  await dispatch(updateCreatingEvent(false))
  await dispatch(updateLoadingCheckInFlag(false))
  /// reset flags for loading
  await dispatch(checkCurrentAuthSession())
  initialNavigation()
  await dispatch(handleAppStartDeepLink())
}
