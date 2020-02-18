import { DispatchType, GetStateType } from 'helpers/types'
import { Race, Session } from 'models'
import { navigateToTrackDetails } from 'navigation'
import { raceUrl } from 'services/CheckInService'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getLatestLeaderboardRace } from 'selectors/leaderboard'

export const openTrackDetails = (race: Race, session?: Session) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkIn = getCheckInByLeaderboardName(race.regattaName)(getState())
  const eventName = session && session.event && session.event.name
  navigateToTrackDetails(raceUrl(checkIn, race), eventName)
}

export const openLatestRaceTrackDetails = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const leaderboardName = getTrackedLeaderboardName(getState())
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(getState())
  const latestRace = { name: getLatestLeaderboardRace(getState()) } as Race

  if (latestRace.name) {
    navigateToTrackDetails(raceUrl(checkIn, latestRace), leaderboardName)
  }
}
