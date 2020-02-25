import { always, merge, defaultTo, toPairs, prop } from 'ramda'
import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { CompetitorGap } from 'reducers/config'
import { clearLeaderboardGaps, updateLeaderboardGaps, updateLatestTrackedRace } from '../actions/leaderboards'

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
    [clearLeaderboardGaps as any]: always({}),
}, {})

const latestTrackedRace = handleActions({
  [updateLatestTrackedRace as any]: (state: any, action: any) => defaultTo(null, action.payload)
}, null)

export default combineReducers({
  competitorGaps,
  latestTrackedRace,
})
