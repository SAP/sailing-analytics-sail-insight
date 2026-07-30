import { DispatchType, GetStateType } from 'helpers/types'
import { Race } from 'models'
import * as Screens from 'navigation/Screens'
import { raceUrl } from 'services/CheckInService'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getLatestLeaderboardRace } from 'selectors/leaderboard'

// Works for both a screen `navigation` prop (getState/getParent) and the
// NavigationContainer ref (getRootState).
const getRootNavigationState = (navigation: any) => {
  if (typeof navigation.getRootState === 'function') {
    return navigation.getRootState()
  }
  let current = navigation
  while (typeof current.getParent === 'function' && current.getParent()) {
    current = current.getParent()
  }
  return typeof current.getState === 'function' ? current.getState() : undefined
}

// react-navigation v7 changed `navigate` to always push instead of going
// back to an existing screen, so returning to Main needs `pop: true` to
// close screens stacked above it (e.g. JoinRegatta after a successful join).
// When Main was never mounted (fresh install: FirstContact is the initial
// route and the invitation opens on top of it), `pop: true` silently degrades
// to a push and leaves the stale screens in the back stack — in that case the
// root stack must be reset to a single Main route instead.
export const navigateBackToMain = (navigation: any, params?: object) => {
  const rootState = getRootNavigationState(navigation)
  const isMainMounted = rootState && rootState.routes &&
    rootState.routes.some((route: any) => route.name === Screens.Main)

  if (isMainMounted || !rootState) {
    navigation.navigate(Screens.Main, params, { pop: true })
    return
  }

  // `Main` is only registered in the root stack, so nested routers reject
  // this RESET and it bubbles up to the root navigator.
  navigation.reset({ index: 0, routes: [{ name: Screens.Main, params }] })
}

export const navigateBackToTracking = (navigation: any, screen?: string) =>
  navigateBackToMain(navigation, {
    screen: Screens.TrackingNavigator,
    ...(screen ? { params: { screen } } : {}),
  })

export const openTrackDetails = (race: Race, navigation:object) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkIn = getCheckInByLeaderboardName(race.regattaName)(getState())

  navigation.navigate(Screens.TrackDetails, { data: { url: raceUrl(checkIn, race) }})
}

export const openLatestRaceTrackDetails = (navigation: object) => async (dispatch: DispatchType, getState: GetStateType) => {
  const leaderboardName = getTrackedLeaderboardName(getState())
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(getState())
  const latestRace = { name: getLatestLeaderboardRace(getState()) } as Race

  if (latestRace.name) {
    // Called from the Tracking tab; TrackDetails is registered in the
    // sessions stack, so the target navigator must be spelled out —
    // v7 no longer resolves screen names across sibling navigators.
    navigateBackToMain(navigation, {
      screen: Screens.SessionsNavigator,
      params: {
        screen: Screens.TrackDetails,
        params: {
          data: {
            url: raceUrl(checkIn, latestRace),
            comingFromTrackingScreen: true,
          },
        },
      },
    })
  }
}
