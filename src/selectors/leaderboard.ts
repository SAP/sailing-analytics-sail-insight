import { compose, all, prop, propEq, head, find, defaultTo } from 'ramda'
import { get, last, values } from 'lodash'
import { createSelector } from 'reselect'

import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'

import {
  Leaderboard,
  LeaderboardColumn,
  LeaderboardColumnData,
  LeaderboardCompetitor,
  LeaderboardCompetitorCurrentTrack,
} from 'models'
import { mapResToLeaderboardColumnData } from 'models/Leaderboard'
import { CompetitorGapMap, RootState } from 'reducers/config'
import { getTrackedLeaderboardName } from 'selectors/location'
import { getSelectedEventInfo } from 'selectors/event'
import { getTrackedCheckIn, getTrackedCheckInCompetitorId } from './checkIn'

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

export const getLeaderboardCompetitorCurrentRaceColumn = (
  competitorData: LeaderboardCompetitor,
): LeaderboardColumn | undefined =>
  competitorData.columns && last(values(competitorData.columns))

export const getTrackedCompetitorLeaderboardRank = createSelector(
  getTrackedLeaderboardEntity,
  getTrackedCheckInCompetitorId,
  (leaderboard, competitorId) => {
    const trackedCompetitor = (leaderboard &&
      leaderboard.competitors &&
      find(propEq('id', competitorId), leaderboard.competitors)) || {}
    const currentLeaderboardTrack =
      trackedCompetitor &&
      getLeaderboardCompetitorCurrentRaceColumn(trackedCompetitor)
    const trackedRank = currentLeaderboardTrack && currentLeaderboardTrack.trackedRank

    return trackedRank
  }
)

export const getLeaderboardGaps = (state: RootState = {}) =>
  state.leaderboardTracking && state.leaderboardTracking.competitorGaps

const extractCompetitorData = (leaderboardGaps: CompetitorGapMap) => (
  competitorData: LeaderboardCompetitor,
): LeaderboardCompetitorCurrentTrack => {
  const currentTrackColumn = getLeaderboardCompetitorCurrentRaceColumn(competitorData)
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

    const competitors = leaderboardData && leaderboardData.competitors
    const stuff =
      competitors &&
      competitors
        .map(extractCompetitorData(gaps))

    return stuff
  })

const createCurrentEventRacesStatusSelector = (status: string) => createSelector(
  getSelectedEventInfo,
  getLeaderboards,
  (event, leaderboards) => compose(
    all(compose(propEq('status', status), defaultTo({}), prop('trackedRace'), head, prop('fleets'))),
    defaultTo({}),
    prop('trackedRacesInfo'),
    find(propEq('name', defaultTo({}, event).leaderboardName)))(
    leaderboards))

export const isCurrentLeaderboardTracking = createCurrentEventRacesStatusSelector('TRACKING')
export const isCurrentLeaderboardFinished = createCurrentEventRacesStatusSelector('FINISHED')
