import { get } from 'lodash'
import { createAction } from 'redux-actions'

import { fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { DispatchType } from 'helpers/types'

import { Leaderboard } from 'models'
import CheckIn from 'models/CheckIn'
import { getLeaderboardCompetitorCurrentRaceColumn } from 'selectors/leaderboard'
import * as LeaderboardService from '../services/LeaderboardService'

export const updateLeaderboardGaps = createAction('UPDATE_LEADERBOARD_GAPS')
export const clearLeaderboardGaps = createAction('CLEAR_LEADERBOARD_GAPS')
export const updateLatestTrackedRace = createAction('UPDATE_LATEST_TRACKED_RACE')

export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })((dataApi, dispatch) =>
    dispatch(fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard)),
  )

export const startLeaderboardUpdates = (checkInData: CheckIn, rankingMetric?: string) =>
  withDataApi(checkInData.serverUrl)(async (dataApi, dispatch) => {
    try {
      dispatch(clearLeaderboardGaps())
      LeaderboardService.startPeriodicalLeaderboardUpdates(
        dispatch,
        dataApi,
        checkInData.leaderboardName,
        checkInData.secret,
        checkInData.competitorId,
        rankingMetric
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
  rankingMetric = 'ONE_DESIGN',
) => async (dispatch: DispatchType) => {
  const payload =
    leaderboard.competitors &&
    leaderboard.competitors.reduce((map, competitor) => {
      const raceColumn = getLeaderboardCompetitorCurrentRaceColumn(competitor)
      let gapToLeader: number | undefined = raceColumn && get(raceColumn, [
        'data',
        rankingMetric === 'ONE_DESIGN' ? 'gapToLeader-m' : 'gapToLeader-s',
      ])

      if (gapToLeader !== undefined) {
        gapToLeader = Math.ceil(gapToLeader)
      }

      return (
        (competitor.id &&
          gapToLeader !== undefined && {
            ...map,
            [competitor.id]: gapToLeader,
          }) ||
        map
      )
    }, {})

  await dispatch(updateLeaderboardGaps(payload))
}
