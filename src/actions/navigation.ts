import { DispatchType, GetStateType } from 'helpers/types'
import { Race } from 'models'
import * as Screens from 'navigation/Screens'
import { raceUrl } from 'services/CheckInService'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getLatestLeaderboardRace } from 'selectors/leaderboard'

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
    navigation.navigate(Screens.TrackDetails, {
      data: {
        url: raceUrl(checkIn, latestRace),
        comingFromTrackingScreen: true,
      },
    })
  }
}
