import { get } from 'lodash'
import { createAction } from 'redux-actions'

import { fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'

import { Leaderboard } from 'models'
import CheckIn from 'models/CheckIn'
import * as LeaderboardService from '../services/LeaderboardService'

export const updateLeaderboardGaps = createAction('UPDATE_LEADERBOARD_GAPS')
export const clearLeaderboardGaps = createAction('CLEAR_LEADERBOARD_GAPS')

export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })(dataApi =>
    fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard),
  )

export const startLeaderboardUpdates = (checkInData: CheckIn) =>
  withDataApi(checkInData.serverUrl)(async (dataApi, dispatch) => {
    try {
      dispatch(clearLeaderboardGaps())
      LeaderboardService.startPeriodicalLeaderboardUpdates(
        dispatch,
        dataApi,
        checkInData.leaderboardName,
        checkInData.secret,
        checkInData.currentTrackName,
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

export const updateLeaderboardTracking = (
  leaderboard: Leaderboard,
  currentTrackName?: string,
) => async (dispatch: DispatchType) => {
  const payload =
    currentTrackName &&
    leaderboard.competitors &&
    leaderboard.competitors.reduce((map, competitor) => {
      // TODO: Maybe this will have to be calculated time at fastest
      let gapToLeader: number | undefined = get(competitor, [
        'columns',
        currentTrackName,
        'data',
        'gapToLeader-s',
      ])

      if (gapToLeader !== undefined) {
        gapToLeader = Math.ceil(gapToLeader)
      }

      return (
        (competitor.id &&
          gapToLeader && {
            ...map,
            [competitor.id]: gapToLeader,
          }) ||
        map
      )
    }, {})

  await dispatch(updateLeaderboardGaps(payload))
}
