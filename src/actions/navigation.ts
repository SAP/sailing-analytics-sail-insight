import { DispatchType, GetStateType } from 'helpers/types'
import { Race, Session } from 'models'
import { navigateToTrackDetails } from 'navigation'
import { raceUrl } from 'services/CheckInService'

import { getCheckInByLeaderboardName } from 'selectors/checkIn'


export const openTrackDetails = (race: Race, session?: Session) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkIn = getCheckInByLeaderboardName(race.regattaName)(getState())
  const eventName = session && session.event && session.event.name
  navigateToTrackDetails(raceUrl(checkIn, race), eventName)
}
