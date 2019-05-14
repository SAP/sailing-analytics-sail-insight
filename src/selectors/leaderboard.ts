import _ from 'lodash'
import { createSelector } from 'reselect'

import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'

import { Leaderboard } from 'models'
import { getTrackedCheckInCompetitorId } from './checkIn'
import { getTrackedLeaderboardName } from './location'

export const getLeaderboardEntity = (state: any) => getEntities(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboards = (state: any) => getEntityArrayByType(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboard = (name: string) => (state: any) =>
  getEntityById(state, LEADERBOARD_ENTITY_NAME, name) as Leaderboard

export const getTrackedLeaderboard = (state: any) => {
  const leaderboardName = getTrackedLeaderboardName(state)
  return getLeaderboard(leaderboardName)(state)
}

export const getTrackedCompetitorLeaderboardData = createSelector(
  getTrackedLeaderboard,
  getTrackedCheckInCompetitorId,
  (leaderboard, competitorId) =>
  leaderboard &&
  leaderboard.competitors &&
  _.find(leaderboard.competitors, { id: competitorId }),
)
