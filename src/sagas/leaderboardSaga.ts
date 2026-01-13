import { defaultTo, filter, fromPairs, head, isNil, prop, not, toPairs,
  propSatisfies, sortBy, last, compose, values, map,
  reverse, gt } from 'ramda'
import { dataApi } from 'api'
import { Leaderboard } from 'models'
import { receiveEntities } from 'actions/entities'
import { isAppActive } from 'selectors/appState'
import { START_POLLING_LEADERBOARD, STOP_POLLING_LEADERBOARD,
  updateLeaderboardPollingStatus } from 'actions/leaderboards'
import { call, put, delay, select, takeLatest } from 'redux-saga/effects'
import { isPollingLeaderboard } from 'selectors/leaderboard'
import { getTrackedRegattaRankingMetric } from 'selectors/regatta'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { updateLeaderboardTracking, updateLatestTrackedRace } from 'actions/leaderboards'
import Logger from 'helpers/Logger'

const isNotNil = compose(not, isNil)

function* syncLeaderboard({ rankOnly }) {
  let isPolling = yield select(isPollingLeaderboard())
  if (!isPolling) {
    isPolling = true
    yield put(updateLeaderboardPollingStatus(true))

    while (true && isPolling)
    {
      const isForeground = yield select(isAppActive())
      if (isForeground) {
        const checkIn = yield select(getTrackedCheckIn)
        const { leaderboardName, secret, competitorId, serverUrl } = checkIn
        const api = dataApi(serverUrl)
        const rankingMetric: string | undefined = yield select(getTrackedRegattaRankingMetric)

        try {
          const response = yield call(api.requestLeaderboardV2, leaderboardName, secret, competitorId, rankOnly)
          yield put(receiveEntities(response))

          const receivedLeaderboards =
            response.entities &&
            response.entities.leaderboard &&
            values(response.entities.leaderboard)
          const receivedLeaderboard = receivedLeaderboards?.[0] as Leaderboard | undefined
          if (!receivedLeaderboard) return

          yield put(updateLeaderboardTracking(receivedLeaderboard, rankingMetric))

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

          const fourMinutesInMillis = 1000 * 60 * 4
          const hasRaceStarted = propSatisfies(gt(new Date().valueOf() - fourMinutesInMillis), 'startTimeMillis')

          const firstStartedRace = compose(
            head, // Just the race name
            defaultTo([]),
            head, // Get the first race by start time
            sortBy(compose(prop('startTimeMillis'), last)),
            toPairs,
            filter(propSatisfies(isNotNil, 'startTimeMillis')),
            filter(isNotNil))(
            trackedRaces)

          const latestTrackedRace = compose(
            head, // Just the race name
            defaultTo([]),
            head, // Get the last race (that already started) by start time
            reverse,
            sortBy(compose(prop('startTimeMillis'), last)),
            toPairs,
            defaultTo({}),
            filter(hasRaceStarted),
            filter(propSatisfies(isNotNil, 'startTimeMillis')),
            filter(isNotNil))(
            trackedRaces)

          yield put(updateLatestTrackedRace(latestTrackedRace || firstStartedRace))
        } catch (err) {
          Logger.debug('Error while executing syncLeaderboard', err)
        }
      }

      yield delay(10000)
      isPolling = yield select(isPollingLeaderboard())
    }
  }
}

function* startPollingLeaderboard({ payload }) {
  yield call(syncLeaderboard, payload)
}

function* stopPollingLeaderboard() {
  yield put(updateLeaderboardPollingStatus(false))
}

export default function* watchLeaderboard() {
  yield takeLatest(START_POLLING_LEADERBOARD, startPollingLeaderboard)
  yield takeLatest(STOP_POLLING_LEADERBOARD, stopPollingLeaderboard)
}
