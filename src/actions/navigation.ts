import { DispatchType, GetStateType } from 'helpers/types'
import { Race } from 'models'
import { navigateToTrackDetails } from 'navigation'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { raceUrl } from 'services/CheckInService'


export const openTrackDetails = (race: Race) => async (dispatch: DispatchType, getState: GetStateType) => {
  const checkIn = getCheckInByLeaderboardName(race.regattaName)(getState())
  navigateToTrackDetails(raceUrl(checkIn, race))
}
