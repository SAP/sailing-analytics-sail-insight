import { DispatchType, GetStateType } from 'helpers/types'
import { Race } from 'models'
import * as Screens from 'navigation/Screens'
import { raceUrl } from 'services/CheckInService'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getLatestLeaderboardRace } from 'selectors/leaderboard'

// react-navigation v7 changed `navigate` to always push instead of going
// back to an existing screen, so returning to Main needs `pop: true` to
// close screens stacked above it (e.g. JoinRegatta after a successful join).
export const navigateBackToMain = (navigation: any, params?: object) =>
  navigation.navigate(Screens.Main, params, { pop: true })

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
