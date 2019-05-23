import { values } from 'lodash'

import { updateLeaderboardTracking } from 'actions/leaderboards'
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
  currentTrackName?: string,
  rankingMetric?: string,
) => {
  try {
    const { payload } = await dispatch(
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard, secret, [currentTrackName]),
    )

    const receivedLeaderboards =
      payload.entities &&
      payload.entities.leaderboard &&
      values(payload.entities.leaderboard)
    const receivedLeaderboard = receivedLeaderboards[0] as Leaderboard

    await dispatch(updateLeaderboardTracking(receivedLeaderboard, currentTrackName, rankingMetric))
  } catch (err) {
    Logger.debug('Error while executing syncLeaderboard', err)
  }
}

export const startPeriodicalLeaderboardUpdates = (
  dispatch: DispatchType,
  dataApi: DataApi,
  leaderboard: string,
  secret?: string,
  currentTrackName?: string,
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
      currentTrackName,
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
