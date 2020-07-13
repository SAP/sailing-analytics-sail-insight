import { get } from 'lodash'
import { defaultTo, filter, fromPairs, head, isNil, prop, not, toPairs,
  propSatisfies, keys, sortBy, identity, last, compose, values, map } from 'ramda'
import { createAction } from 'redux-actions'

import { fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { DispatchType, GetStateType } from 'helpers/types'

import { dataApi } from 'api'
import { Leaderboard } from 'models'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getLeaderboardCompetitorCurrentRaceColumn } from 'selectors/leaderboard'
import { isNetworkConnected } from 'selectors/network'
import { getTrackedRegattaRankingMetric } from 'selectors/regatta'

export const updateLeaderboardGaps = createAction('UPDATE_LEADERBOARD_GAPS')
export const clearLeaderboardGaps = createAction('CLEAR_LEADERBOARD_GAPS')
export const updateLatestTrackedRace = createAction('UPDATE_LATEST_TRACKED_RACE')
export const updateLeaderboardStale = createAction('UPDATE_LEADERBOARD_STALE')

export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })((dataApi, dispatch, getState) => {
    // Ignore the call if offline
    if (isNetworkConnected(getState())) {
      return dispatch(fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard))
    }
  }
  )

const updateLeaderboardTracking = (
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

const syncLeaderboard = (rankOnly: boolean) => async (dispatch: DispatchType, getState: GetStateType) => {
  const checkIn = getTrackedCheckIn(getState())
  const { leaderboardName, secret, competitorId, serverUrl } = checkIn
  const api = dataApi(serverUrl)

  const rankingMetric: string | undefined = getTrackedRegattaRankingMetric(getState())
  try {
    const { payload } = await dispatch(
      fetchEntityAction(api.requestLeaderboardV2)(leaderboardName, secret, competitorId, rankOnly))

    const receivedLeaderboards =
      payload.entities &&
      payload.entities.leaderboard &&
      values(payload.entities.leaderboard)
    const receivedLeaderboard = receivedLeaderboards[0] as Leaderboard
    await dispatch(updateLeaderboardTracking(receivedLeaderboard, rankingMetric))

    const latestStartedRace = compose(
      last,
      sortBy(identity),
      keys,
      prop('columns'),
      prop('competitors'))(
      receivedLeaderboard)

    if (latestStartedRace) {
      await dispatch(updateLatestTrackedRace(latestStartedRace))
    } else {
      const trackedRaces = compose(
        fromPairs,
        map(trackedRace => ([
          trackedRace.raceColumnName,
          compose(
            prop('trackedRace'),
            defaultTo({}),
            head,
            defaultTo([])
          )(trackedRace.fleets),
        ])),
        defaultTo([]),
        prop('trackedRacesInfo')
      )(receivedLeaderboard)

      const isNotNil = compose(not, isNil)

      const firstStartedRace = compose(
        head, // Just the race name
        defaultTo([]),
        head, // Get the first race by start time
        sortBy(compose(prop('startTimeMillis'), last)),
        toPairs,
        filter(propSatisfies(isNotNil, 'startTimeMillis')),
        filter(isNotNil)
      )(trackedRaces)

      await dispatch(updateLatestTrackedRace(firstStartedRace))
    }
  } catch (err) {
    Logger.debug('Error while executing syncLeaderboard', err)
  }
}

const DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS = 5000

export const startPeriodicLeaderboardUpdates = (rankOnly: boolean) => (dispatch: DispatchType) => {
  dispatch(updateLeaderboardStale(true))
  dispatch(clearLeaderboardGaps())
  const callback = () => dispatch(syncLeaderboard(rankOnly))
  const interval = setInterval(callback, DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS)
  // So that the period doesn't have to pass for the first fetch of the data
  setImmediate(() => callback().finally(() => dispatch(updateLeaderboardStale(false))))
  return interval
}
export const stopPeriodicLeaderboardUpdates = (interval?: any) => (dispatch: DispatchType) => {
  dispatch(updateLeaderboardStale(true))
  if (interval) {
    clearInterval(interval)
  }
}
