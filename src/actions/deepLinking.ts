import { Linking } from 'react-native'

import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'
import * as DeepLinking from 'integrations/DeepLinking'
import { createCheckInUrlFromParams } from 'models/CheckIn'

import { joinLinkInvitation } from './checkIn'


export const CHECK_IN_URL_KEY = 'checkinUrl'

// On a cold start from a link, Branch delivers the same link twice: once via
// the subscribe listener and once via getLatestReferringParams in
// handleAppStartDeepLink. Swallow the second delivery so the invitation is
// not fetched (and joined) twice — but only within a short window, so
// re-tapping the same invitation later still works.
const DUPLICATE_LINK_WINDOW_MS = 5000
let lastHandledLink = { url: null as string | null, at: 0 }

const isDuplicateDelivery = (checkInUrl: string) => {
  const now = Date.now()
  const isDuplicate = lastHandledLink.url === checkInUrl &&
    now - lastHandledLink.at < DUPLICATE_LINK_WINDOW_MS
  lastHandledLink = { url: checkInUrl, at: now }
  return isDuplicate
}

const getCheckInUrl = (linkParams: any) => {
  if (!linkParams) {
    return null
  }
  return linkParams[CHECK_IN_URL_KEY] || createCheckInUrlFromParams(linkParams) || null
}

// Parse the query string of a raw URL into a plain params object, decoding
// each value once (checkinUrl arrives percent-encoded in the intent URL).
const parseQueryParams = (url: string) => {
  const queryStart = url.indexOf('?')
  if (queryStart === -1) {
    return {}
  }
  return url.slice(queryStart + 1).split('&').reduce((acc: any, pair) => {
    if (!pair) {
      return acc
    }
    const eq = pair.indexOf('=')
    const rawKey = eq === -1 ? pair : pair.slice(0, eq)
    const rawValue = eq === -1 ? '' : pair.slice(eq + 1)
    try {
      acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue)
    } catch {
      acc[rawKey] = rawValue
    }
    return acc
  }, {})
}

// Branch-independent source for the opening link. Branch only hands over the
// link params after a successful round trip to api2.branch.io, which fails
// when the app is offline or when an ad-blocker / Private DNS blackholes that
// host. The checkinUrl is a plain query param on the intent URL, so we can
// still recover it straight from getInitialURL() without Branch.
export const getInitialUrlParams = async () => {
  try {
    const url = await Linking.getInitialURL()
    return url ? parseQueryParams(url) : null
  } catch (err) {
    Logger.debug(err)
    return null
  }
}

// Used by initializeApp to decide whether to show the check-in spinner
// before the (slow) rest of the app init runs.
export const containsCheckInLink = (linkParams: any) => !!getCheckInUrl(linkParams)

const getDeepLinkAction = (linkParams: any, navigation: any) => {
  const checkInUrl = getCheckInUrl(linkParams)
  if (!checkInUrl || isDuplicateDelivery(checkInUrl)) {
    return null
  }
  return joinLinkInvitation(checkInUrl, navigation)
}

export const performDeepLink = (linkParams: any, navigation: any) => (dispatch: DispatchType) => {
  const deepLinkAction = getDeepLinkAction(linkParams, navigation)
  return deepLinkAction && dispatch(deepLinkAction)
}

// Returns whether a deep-link action was actually dispatched (false when
// there was no link or the delivery was a cold-start duplicate).
export const handleAppStartDeepLink = (navigation: any, linkParams?: any) => async (dispatch: DispatchType) => {
  try {
    const params = linkParams !== undefined ? linkParams : await DeepLinking.lastLinkParams()
    const deepLinkAction = getDeepLinkAction(params, navigation)
    if (deepLinkAction) {
      await dispatch(deepLinkAction)
      return true
    }
    // Fallback when Branch delivered no usable link (error / offline / its API
    // host blocked): recover the checkinUrl from the raw intent URL. Runs
    // through getDeepLinkAction so the duplicate-delivery guard still applies —
    // when Branch did work, this resolves to the same url and is swallowed.
    const fallbackAction = getDeepLinkAction(await getInitialUrlParams(), navigation)
    if (fallbackAction) {
      await dispatch(fallbackAction)
      return true
    }
  } catch (err) { Logger.debug(err) }
  return false
}
