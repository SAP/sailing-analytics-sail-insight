import { get } from 'lodash'
import { createAction } from 'redux-actions'

import { fetchEntityAction, withDataApi } from 'helpers/actions'
import { DispatchType } from 'helpers/types'

import { Leaderboard } from 'models'
import { getLeaderboardCompetitorCurrentRaceColumn } from 'selectors/leaderboard'
import { isNetworkConnected } from 'selectors/network'

export const UPDATE_LEADERBOARD_POLLING_STATUS = 'UPDATE_LEADERBOARD_POLLING_STATUS'
export const START_POLLING_LEADERBOARD = 'START_POLLING_LEADERBOARD'
export const STOP_POLLING_LEADERBOARD = 'STOP_POLLING_LEADERBOARD'
export const updateLeaderboardGaps = createAction('UPDATE_LEADERBOARD_GAPS')
export const updateLatestTrackedRace = createAction('UPDATE_LATEST_TRACKED_RACE')
export const startLeaderboardSync = createAction('START_LEADERBOARD_SYNC')

export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })((dataApi, dispatch, getState) => {
    // Ignore the call if offline
    if (isNetworkConnected(getState())) {
      return dispatch(fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard))
    }
  }
)

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

export const updateLeaderboardPollingStatus = createAction(UPDATE_LEADERBOARD_POLLING_STATUS)
export const startPollingLeaderboard = createAction(START_POLLING_LEADERBOARD)
export const stopPollingLeaderboard = createAction(STOP_POLLING_LEADERBOARD)