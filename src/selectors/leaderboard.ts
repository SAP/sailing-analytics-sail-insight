import _, { get } from 'lodash'
import { createSelector } from 'reselect'

import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'

import {
  CheckIn,
  Leaderboard,
  LeaderboardColumn,
  LeaderboardColumnData,
  LeaderboardCompetitor,
  LeaderboardCompetitorCurrentTrack,
} from 'models'
import { mapResToLeaderboardColumnData } from 'models/Leaderboard'
import { CompetitorGapMap, RootState } from 'reducers/config'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getTrackedCheckIn } from './checkIn'

export const getLeaderboardEntity = (state: any) =>
  getEntities(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboards = (state: any) =>
  getEntityArrayByType(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboard = (name: string) => (state: any) =>
  getEntityById(state, LEADERBOARD_ENTITY_NAME, name) as Leaderboard

export const getTrackedLeaderboardEntity = (state: any) => {
  const leaderboardName = getTrackedLeaderboardName(state)
  return getLeaderboard(leaderboardName)(state)
}

export const getTrackedCompetitorLeaderboardRank = createSelector(
  getTrackedLeaderboardEntity,
  getTrackedCheckIn,
  (leaderboard, checkInData) => {
    const competitorId = checkInData && checkInData.competitorId
    const currentTrackName = checkInData && checkInData.currentTrackName
    const trackedCompetitor = (leaderboard &&
      leaderboard.competitors &&
      _.find(leaderboard.competitors, { id: competitorId })) || {}
    const currentLeaderboardTrack =
      trackedCompetitor &&
      currentTrackName &&
      get(trackedCompetitor, ['columns', currentTrackName])
    const trackedRank = currentLeaderboardTrack && currentLeaderboardTrack.trackedRank

    return trackedRank
  }
)

export const getLeaderboardGaps = (state: RootState = {}) =>
  state.leaderboardTracking && state.leaderboardTracking.competitorGaps

const extractCompetitorData = (
  checkInData: CheckIn,
  leaderboardGaps: CompetitorGapMap,
) => (
  competitorData: LeaderboardCompetitor,
): LeaderboardCompetitorCurrentTrack => {
  const currentTrackName = checkInData && checkInData.currentTrackName

  const currentTrackColumn: LeaderboardColumn | undefined =
    currentTrackName && get(competitorData, ['columns', currentTrackName])

  const currentTrackColumnData: LeaderboardColumnData | undefined =
    currentTrackColumn &&
    mapResToLeaderboardColumnData(get(currentTrackColumn, 'data'))

  const id = competitorData && competitorData.id
  const gain: boolean | undefined = id && get(leaderboardGaps, [id, 'gaining'])

  return {
    ...competitorData,
    gain,
    trackedColumn: currentTrackColumn,
    trackedColumnData: currentTrackColumnData,
  }
}

export const getTrackedLeaderboard = createSelector(
  getTrackedLeaderboardEntity,
  getTrackedCheckIn,
  getLeaderboardGaps,
  (leaderboardData, checkInData, leaderboardGaps) => {
    const gaps = leaderboardGaps || ({} as CompetitorGapMap)

    const currentFleet = checkInData && checkInData.currentFleet

    const competitors = leaderboardData.competitors
    const stuff =
      competitors &&
      competitors
        .map(extractCompetitorData(checkInData, gaps))
        .filter(
          (datum: LeaderboardCompetitorCurrentTrack) =>
            datum.trackedColumn && datum.trackedColumn.fleet === currentFleet,
        )

    return stuff
  },
)
