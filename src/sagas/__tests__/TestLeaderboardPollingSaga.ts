/**
 * Desired behavior of leaderboard polling (sagas/leaderboardSaga.ts).
 *
 * - START_POLLING_LEADERBOARD dispatched twice (e.g. tracking screen re-mounted)
 *   must still leave exactly one active polling loop that calls the API every 10s.
 * - A response without a leaderboard (or any single bad fetch) must not end the
 *   polling loop while the `isLeaderboardPolling` flag stays true.
 */
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'

import { START_POLLING_LEADERBOARD, UPDATE_LEADERBOARD_POLLING_STATUS } from 'actions/leaderboards'

declare var beforeEach: any
declare var afterEach: any
declare var test: any
declare var expect: any

const mockRequestLeaderboard = jest.fn()
jest.mock('api', () => ({ dataApi: () => ({ requestLeaderboardV2: mockRequestLeaderboard }) }))
jest.mock('selectors/appState', () => ({ isAppActive: () => () => true }))
jest.mock('selectors/checkIn', () => ({
  getTrackedCheckIn: () => ({ leaderboardName: 'lb', secret: 's', competitorId: 'c', serverUrl: 'https://x' }),
  getTrackedCheckInCompetitorId: () => 'c',
}))
jest.mock('selectors/regatta', () => ({ getTrackedRegattaRankingMetric: () => undefined }))
jest.mock('selectors/leaderboard', () => ({
  isPollingLeaderboard: () => (state: any) => !!state.leaderboardTracking.isLeaderboardPolling,
}))

// eslint-disable-next-line import/first
import watchLeaderboard from '../leaderboardSaga'

const reducer = (state: any = { leaderboardTracking: { isLeaderboardPolling: false } }, action: any) =>
  action.type === UPDATE_LEADERBOARD_POLLING_STATUS ?
    { ...state, leaderboardTracking: { isLeaderboardPolling: action.payload } } :
    state

const flush = async () => {
  for (let i = 0; i < 20; i++) { await Promise.resolve() }
}

let task: any
const startStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware))
  task = sagaMiddleware.run(watchLeaderboard)
  return store
}

const advance = async (ms: number) => {
  jest.advanceTimersByTime(ms)
  await flush()
}

beforeEach(() => {
  jest.useFakeTimers()
  mockRequestLeaderboard.mockReset()
})

afterEach(() => {
  task && task.cancel()
  jest.useRealTimers()
})

// User impact: the live rank on the tracking screen freezes for the rest of the race.
test('after two START_POLLING_LEADERBOARD actions the leaderboard is still polled periodically', async () => {
  mockRequestLeaderboard.mockResolvedValue({ entities: { leaderboard: { lb: { name: 'lb', trackedRacesInfo: [] } } } })
  const store = startStore()

  store.dispatch({ type: START_POLLING_LEADERBOARD, payload: { rankOnly: true } })
  await flush()
  store.dispatch({ type: START_POLLING_LEADERBOARD, payload: { rankOnly: true } })
  await flush()
  const callsAfterStart = mockRequestLeaderboard.mock.calls.length

  await advance(10000)
  await advance(10000)
  await advance(10000)

  expect(mockRequestLeaderboard.mock.calls.length - callsAfterStart).toBeGreaterThanOrEqual(3)
})

test('a response without a leaderboard does not stop polling', async () => {
  mockRequestLeaderboard
    .mockResolvedValueOnce({ entities: {} }) // e.g. server hiccup / empty payload
    .mockResolvedValue({ entities: { leaderboard: { lb: { name: 'lb', trackedRacesInfo: [] } } } })
  const store = startStore()

  store.dispatch({ type: START_POLLING_LEADERBOARD, payload: { rankOnly: true } })
  await flush()
  expect(mockRequestLeaderboard).toHaveBeenCalledTimes(1)

  await advance(10000)
  await advance(10000)

  expect(mockRequestLeaderboard.mock.calls.length).toBeGreaterThanOrEqual(3)
})

// Regression guard (passes today): a rejected request keeps polling.
test('a failed fetch does not stop polling', async () => {
  mockRequestLeaderboard
    .mockRejectedValueOnce(new TypeError('Network request failed'))
    .mockResolvedValue({ entities: { leaderboard: { lb: { name: 'lb', trackedRacesInfo: [] } } } })
  const store = startStore()

  store.dispatch({ type: START_POLLING_LEADERBOARD, payload: { rankOnly: true } })
  await flush()
  await advance(10000)
  await advance(10000)

  expect(mockRequestLeaderboard.mock.calls.length).toBeGreaterThanOrEqual(3)
})
