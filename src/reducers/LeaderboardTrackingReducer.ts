import { get, toPairs } from 'lodash'
import { handleActions } from 'redux-actions'

import { CompetitorGap, LeaderboardTrackingState } from 'reducers/config'

import { clearLeaderboardGaps, updateLeaderboardGaps  } from '../actions/leaderboards'

const initialState: LeaderboardTrackingState = {
  competitorGaps: {} as Map<string, CompetitorGap>,
}

const reducer = handleActions(
  {
    [updateLeaderboardGaps as any]: (state: any = {}, action: any) => {
      if (!action || !action.payload) {
        return state
      }

      const oldGaps = state.competitorGaps


      const updates = toPairs(action.payload)
        .reduce((aggregator: any, [competitor, gap]: any[]) => {
          const previousGap: CompetitorGap | undefined = get(
            oldGaps,
            competitor,
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

          return {
            ...aggregator,
            [competitor]: competitorGap,
          }

        },{})

      return {
        ...state,
        competitorGaps: {
          ...state.competitorGaps,
          ...updates,
        },
      }
    },
    [clearLeaderboardGaps as any]: () => initialState
  },
  initialState,
)

export default reducer
