import { DispatchType } from 'helpers/types'

import { checkCurrentAuthSession } from './auth'
import { handleAppStartDeepLink } from './deepLinking'
import { updateCreatingEvent, updateLoadingEventList, updateSelectingEvent, updateStartingTracking } from './events'
import { updateDeletingMarkBinding, updateLoadingCheckInFlag } from './checkIn'
import { updateCommunicationSettings } from './settings'
import { updateStartLine, stopUpdateStartLineBasedOnCurrentCourse } from './communications'

export const initializeApp = (navigation:object) => async (dispatch: DispatchType) => {
  /// reset flags for loading
  await dispatch(updateCreatingEvent(false))
  await dispatch(updateLoadingCheckInFlag(false))
  dispatch(updateSelectingEvent(false))
  dispatch(updateDeletingMarkBinding(false))
  dispatch(updateStartingTracking(false))
  dispatch(updateLoadingEventList(false))
  dispatch(updateStartLine({}))
  dispatch(stopUpdateStartLineBasedOnCurrentCourse())
  /// reset flags for loading

  /// update native modules settings
  dispatch(updateCommunicationSettings())
  /// update native modules settings

  await dispatch(checkCurrentAuthSession())
  await dispatch(handleAppStartDeepLink(navigation))
}
