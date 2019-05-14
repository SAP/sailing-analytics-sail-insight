import { DataApi } from 'api'
import Logger from '../helpers/Logger'
import { DispatchType } from '../helpers/types'

import { fetchEntityAction } from 'helpers/actions'

export const DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS = 5000

let intervalID: NodeJS.Timer | undefined

export const backgroundSyncLeaderboard = async (
  dispatch: DispatchType,
  dataApi: DataApi,
  leaderboard: string,
  secret?: string,
) => {
  try {
    await dispatch(
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard, secret),
    )
  } catch (err) {
    Logger.debug('Error while executing syncLeaderboard', err)
  }
}

export const startPeriodicalLeaderboardUpdates = (
  dispatch: DispatchType,
  dataApi: DataApi,
  leaderboard: string,
  secret?: string,
) => {
  Logger.debug('[Leaderboard] Transfer Manager started')
  const interval = DEFAULT_UPDATE_TIME_INTERVAL_IN_MILLIS
  const callback = async () => {
    backgroundSyncLeaderboard(dispatch, dataApi, leaderboard, secret)
  }
  if (intervalID) {
    Logger.debug('[Leaderboard] Transfer Manager already running. Clearing old timer')
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
