import { DispatchType } from 'helpers/types'

import { checkCurrentAuthSession } from './auth'
import { handleAppStartDeepLink } from './deepLinking'
import { updateCreatingEvent, updateLoadingEventList, updateSelectingEvent, updateStartingTracking, updateEventPollingStatus } from './events'
import { updateDeletingMarkBinding, updateLoadingCheckInFlag } from './checkIn'
import { updateCommunicationSettings, updateMtcpSettings } from './settings'
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
  dispatch(updateEventPollingStatus(false))
  /// reset flags for loading

  /// update native modules settings
  dispatch(updateCommunicationSettings())
  dispatch(updateMtcpSettings())
  /// update native modules settings

  await dispatch(checkCurrentAuthSession())
  await dispatch(handleAppStartDeepLink(navigation))
}
