import { fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'

import CheckIn from 'models/CheckIn'
import * as LeaderboardService from '../services/LeaderboardService'

export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })(dataApi => fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard))

export const startLeaderboardUpdates = (checkInData: CheckIn) =>
  withDataApi(checkInData.serverUrl)(async (dataApi, dispatch) => {
    try {
      LeaderboardService.startPeriodicalLeaderboardUpdates(
        dispatch,
        dataApi,
        checkInData.leaderboardName,
        checkInData.secret,
      )
    } catch (err) {
      Logger.debug('Error during startLeaderboardUpdates', err)
    }
  })

export const stopLeaderboardUpdates = () => async () => {
  Logger.debug('Stopping Leaderboard updates...')
  try {
    LeaderboardService.stopLeaderboardUpdates()
    Logger.debug('Leaderboard updates stopped.')
  } catch (e) {
    Logger.debug('Error during stopping location updates', e)
  }
}
