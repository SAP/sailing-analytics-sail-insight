import { DispatchType } from 'helpers/types'
import * as DeepLinking from 'integrations/DeepLinking'

import { checkCurrentAuthSession } from './auth'
import { containsCheckInLink, getInitialUrlParams, handleAppStartDeepLink } from './deepLinking'
import { updateCreatingEvent, updateLoadingEventList, updateSelectingEvent, updateStartingTracking, updateEventPollingStatus } from './events'
import { updateDeletingMarkBinding, updateLoadingCheckInFlag, isJoinLinkInvitationInFlight } from './checkIn'
import { initLocationUpdates } from './locations'
import { updateStartLine, stopUpdateStartLineBasedOnCurrentCourse } from './communications'
import * as LocationService from 'services/LocationService'

// Branch can be slow to deliver the opening link params (session init,
// especially offline). The peek below only exists to show the spinner early —
// never let it hold up the whole app init. On timeout it resolves undefined,
// which makes handleAppStartDeepLink fetch the params itself later, exactly
// like before this optimization.
const LINK_PARAMS_TIMEOUT_MS = 3000
const peekDeepLinkParams = async () => {
  const branchParams = await Promise.race([
    DeepLinking.lastLinkParams().catch(() => undefined),
    new Promise(resolve => setTimeout(() => resolve(undefined), LINK_PARAMS_TIMEOUT_MS)),
  ])
  if (containsCheckInLink(branchParams)) {
    return branchParams
  }
  // Branch handed over nothing usable (slow / offline / api2.branch.io blocked
  // by an ad-blocker or Private DNS). The checkinUrl is also a plain param on
  // the raw intent URL, so fall back to it — this both shows the spinner early
  // and lets handleAppStartDeepLink join without Branch.
  const urlParams = await getInitialUrlParams()
  return containsCheckInLink(urlParams) ? urlParams : branchParams
}

export const initializeApp = (navigation:object) => async (dispatch: DispatchType) => {
  /// reset flags for loading — the flags are persisted, so a kill mid-action
  /// leaves them stale. Must run before the first await: the Branch deep-link
  /// listener can fire early and set isLoadingCheckIn for a live join, which
  /// this reset would otherwise kill mid-fetch.
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

  // If the app was opened via an invitation link, show the check-in spinner
  // through the whole init — location service and auth take seconds and the
  // deep link is only handled after them. joinLinkInvitation clears the flag.
  const deepLinkParams = await peekDeepLinkParams()
  const expectsCheckInLink = containsCheckInLink(deepLinkParams)
  if (expectsCheckInLink) {
    dispatch(updateLoadingCheckInFlag(true))
  }

  await LocationService.ready()
  await dispatch(initLocationUpdates())

  await dispatch(checkCurrentAuthSession())
  const handled = await dispatch(handleAppStartDeepLink(navigation, deepLinkParams))

  // The link can be swallowed as a cold-start duplicate because the live
  // Branch listener already handled it. That join clears the flag itself —
  // but if it finished before the early-set above, nobody would. Only clear
  // when no join is running, so a live join keeps its spinner.
  if (expectsCheckInLink && !handled && !isJoinLinkInvitationInFlight()) {
    dispatch(updateLoadingCheckInFlag(false))
  }
}
