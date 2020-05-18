import { fromPairs, head, defaultTo, filter, isNil, prop, find, not, toPairs,
  propEq, propSatisfies, keys, sortBy, identity, last, compose, values, map } from 'ramda'
import { updateLeaderboardTracking, updateLatestTrackedRace } from 'actions/leaderboards'
import { DataApi } from 'api'
import { fetchEntityAction } from 'helpers/actions'
import { Leaderboard } from 'models'
import Logger from '../helpers/Logger'
import { DispatchType } from '../helpers/types'

export const DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS = 5000

let intervalID: NodeJS.Timer | undefined

export const backgroundSyncLeaderboard = async (
  dispatch: DispatchType,
  dataApi: DataApi,
  leaderboard: string,
  secret?: string,
  competitorId?: string,
  rankingMetric?: string,
) => {
  try {
    const { payload } = await dispatch(
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard, secret, competitorId))

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

export const startPeriodicalLeaderboardUpdates = (
  dispatch: DispatchType,
  dataApi: DataApi,
  leaderboard: string,
  secret?: string,
  competitorId?: string,
  rankingMetric?: string,
) => {
  Logger.debug('[Leaderboard] Transfer Manager started')
  const interval = DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS
  const callback = async () => {
    backgroundSyncLeaderboard(
      dispatch,
      dataApi,
      leaderboard,
      secret,
      competitorId,
      rankingMetric
    )
  }
  if (intervalID) {
    Logger.debug(
      '[Leaderboard] Transfer Manager already running. Clearing old timer',
    )
    clearInterval(intervalID)
    intervalID = undefined
  }
  intervalID = setInterval(callback, interval)
  // So that `interval` doesn't have to pass for the first fetch of the data
  setImmediate(callback)
}

export const stopLeaderboardUpdates = () => {
  Logger.debug('[Leaderboard] Transfer Manager stopped')
  if (intervalID) {
    clearInterval(intervalID)
    intervalID = undefined
  }
}
