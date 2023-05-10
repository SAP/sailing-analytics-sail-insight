import { compose, all, prop, propEq, head, find, defaultTo, any } from 'ramda'
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
import { getCompetitor } from './competitor'

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

export const getLatestLeaderboardRace = (state: any) =>
  state.leaderboardTracking.latestTrackedRace

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
      find(propEq(competitorId, 'id'), leaderboard.competitors)) || {}
    const currentLeaderboardTrack =
      trackedCompetitor &&
      getLeaderboardCompetitorCurrentRaceColumn(trackedCompetitor)
    const rank = currentLeaderboardTrack && currentLeaderboardTrack.rank

    return rank
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

const eventRacesStatusSelector = (status: string) => (leaderboardName: any, leaderboards: any) => compose(
    all(compose(propEq(status, 'status'), defaultTo({}), prop('trackedRace'), head, prop('fleets'))),
    defaultTo({}),
    prop('trackedRacesInfo'),
    find(propEq(leaderboardName, 'name')))(
    leaderboards)

const createCurrentEventRacesStatusAllSelector = (status: string) => createSelector(
  getSelectedEventInfo,
  getLeaderboards,
  (event: any, leaderboards: any) => eventRacesStatusSelector(status)(
    defaultTo({}, event).leaderboardName, leaderboards
  )
)

export const isLeaderboardFinished = eventRacesStatusSelector('FINISHED')

const createCurrentEventRacesStatusAnySelector = (status: string) => createSelector(
  getSelectedEventInfo,
  getLeaderboards,
  (event, leaderboards) => compose(
    any(compose(propEq(status, 'status'), defaultTo({}), prop('trackedRace'), head, prop('fleets'))),
    defaultTo({}),
    prop('trackedRacesInfo'),
    find(propEq(defaultTo({}, event).leaderboardName, 'name')))(
    leaderboards))

export const isCurrentLeaderboardTracking = createCurrentEventRacesStatusAnySelector('TRACKING')
export const isCurrentLeaderboardFinished = createCurrentEventRacesStatusAllSelector('FINISHED')
export const isLeaderboardStale = (state: any) => state.leaderboardTracking.isLeaderboardStale
export const isPollingLeaderboard = () => (state: any) =>
  !!(state.leaderboardTracking && state.leaderboardTracking.isLeaderboardPolling)

export const getExistingLeaderboardCompetitor = (leaderboardName: string) => (state: any) => {
    // allow for all users (anonymous or logged)
    const currentLeaderboard = getLeaderboard(leaderboardName)(state)
    let existingBinding = null

    if (currentLeaderboard && currentLeaderboard.competitors) {
      currentLeaderboard.competitors.forEach(competitor => {
        let competitorMatch = getCompetitor(competitor.id)(state)

        if (competitorMatch) {
          existingBinding = competitorMatch
        }
      })
    }

    return existingBinding
}
