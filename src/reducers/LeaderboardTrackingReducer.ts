import { always, merge, defaultTo, toPairs, prop } from 'ramda'
import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { CompetitorGap } from 'reducers/config'
import {
  startPollingLeaderboard,
  stopPollingLeaderboard,
  updateLatestTrackedRace,
  updateLeaderboardGaps,
  updateLeaderboardPollingStatus
} from '../actions/leaderboards'

const competitorGaps = handleActions({
    [updateLeaderboardGaps as any]: (state: any = {}, action: any) => {
      if (!action || !action.payload) {
        return state
      }

      const oldGaps = state

      const updates = toPairs(action.payload)
        .reduce((aggregator: any, [competitor, gap]: any[]) => {
          const previousGap: CompetitorGap | undefined = prop(
            competitor,
            oldGaps,
          )

          let competitorGap

          if (!previousGap) {
            competitorGap = {
              gap,
              gaining: undefined,
            }
          } else {
            const gaining =
              previousGap.gap > gap
                ? true
                : previousGap.gap < gap
                ? false
                : undefined

            competitorGap = {
              gap,
              gaining,
            }
          }

          return merge(aggregator, { [competitor]: competitorGap })
        },      {})

      return merge(state, updates)
    },
    [startPollingLeaderboard as any]: always({}),
}, {})

const latestTrackedRace = handleActions({
  [updateLatestTrackedRace as any]: (state: any, action: any) => defaultTo(null, action.payload)
}, null)

const isLeaderboardStale = handleActions({
  [startPollingLeaderboard as any]: always(false),
  [stopPollingLeaderboard as any]: always(true)
}, false)

const isLeaderboardPolling = handleActions({
  [updateLeaderboardPollingStatus as any]: (state: any, action: any) => action.payload
}, false)

export default combineReducers({
  competitorGaps,
  latestTrackedRace,
  isLeaderboardStale,
  isLeaderboardPolling
})
