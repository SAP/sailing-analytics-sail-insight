/**
 * Define Races screen: discards, race start times and background refresh.
 *
 * Runs the real events saga (watchEvents) via `runSaga` with a fake store and
 * a fake API (`dataApi` from 'api' is mocked). Assertions are on dispatched
 * actions, API calls and `Snackbar.show`.
 *
 * Contracts assumed by these tests:
 *  - Write failures are surfaced with `Snackbar.show` (any text), e.g. via
 *    `showSaveFailedSnackbarMessage` from helpers/network.
 *  - The out-of-event-bounds confirmation is `Alert.alert(..., buttons)` with a
 *    button whose text is I18n.t('button_proceed') (unchanged from today).
 *  - Background refresh: a race-time / course result that is not a non-null
 *    object (e.g. '' from an empty 200 body) is ignored, and every result is
 *    written under the key of the race it was requested for.
 */
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { runSaga, stdChannel } from 'redux-saga'

declare var describe: any
declare var test: any
declare var expect: any
declare var beforeEach: any
declare var afterEach: any

const REGATTA = 'Regatta A'
const LEADERBOARD = 'Leaderboard A'
const SERVER = 'https://example.com'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const ok = (value: any = {}) => jest.fn(async () => value)
const fail = () => jest.fn(async () => { throw new Error('server error') })

let mockApi: any = {}

jest.mock('api', () => ({
  ...jest.requireActual('api'),
  dataApi: () => mockApi,
  selfTrackingApi: () => mockApi,
}))

// eslint-disable-next-line import/first
import { fetchRacesTimesForEvent, setDiscards, setRaceTime } from 'actions/events'
// eslint-disable-next-line import/first
import { fetchCoursesForEvent } from 'actions/courses'
// eslint-disable-next-line import/first
import I18n from 'i18n'
// eslint-disable-next-line import/first
import watchEvents from 'sagas/EventsSaga'

const session = {
  eventId: 'ev1',
  regattaName: REGATTA,
  leaderboardName: LEADERBOARD,
  serverUrl: SERVER,
  trackPrefix: 'R',
}

const EVENT_START = new Date('2026-06-01T08:00:00Z').valueOf()
const EVENT_END = new Date('2026-06-03T18:00:00Z').valueOf()

let dispatched: any[] = []
let task: any

function startSaga(races: string[] = ['R1', 'R2', 'R3']) {
  const state: any = {
    entities: {
      regatta: { [REGATTA]: { name: REGATTA, series: [{ name: 'Default', races }] } },
      leaderboard: {},
    },
    events: { selectedEvent: 'ev1', all: { ev1: { id: 'ev1', startDate: EVENT_START, endDate: EVENT_END } } },
    checkIn: { active: { [LEADERBOARD]: session } },
    auth: { user: { username: 'tester' } },
  }
  const channel = stdChannel()
  const dispatch: any = (action: any) => {
    if (typeof action === 'function') { return undefined }
    dispatched.push(action)
    channel.put(action)
    return action
  }
  task = runSaga({ channel, dispatch, getState: () => state }, watchEvents)
  return dispatch
}

const actionsOfType = (type: string) => dispatched.filter(a => a.type === type)

beforeEach(() => {
  jest.clearAllMocks()
  dispatched = []
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  mockApi = {
    updateEvent: ok(),
    updateRaceTime: ok(),
    setTrackingTimes: ok(),
    updateLeaderboard: ok(),
    requestLeaderboardV2: ok({ entities: {} }),
    requestRaceTime: ok({}),
    requestCourse: ok({}),
    startTracking: ok(),
  }
})

afterEach(() => {
  if (task) { task.cancel() }
  task = undefined
  ;(console.warn as any).mockRestore()
  jest.restoreAllMocks()
})

describe('setDiscards', () => {
  // User-facing problem: the discard change silently does not get saved.
  test('a failed leaderboard update shows an error snackbar', async () => {
    mockApi.updateLeaderboard = fail()
    const dispatch = startSaga()

    dispatch(setDiscards({ discards: [3, 6], session }))
    await sleep(50)

    expect(mockApi.updateLeaderboard).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })
})

describe('setRaceTime', () => {
  const raceTime = { startTimeAsMillis: EVENT_START + 3600000 }

  // User-facing problem: user confirms moving the event end, the server
  // rejects it, and the picked race time just vanishes without a word.
  test('a failed event-boundary update after "proceed" shows an error snackbar', async () => {
    mockApi.updateEvent = fail()
    jest.spyOn(Alert, 'alert').mockImplementation((_t: any, _m: any, buttons: any[] = []) => {
      const proceed = buttons.find(b => b.text === I18n.t('button_proceed'))
      if (proceed) { proceed.onPress() }
    })
    const dispatch = startSaga()

    dispatch(setRaceTime({ race: 'R2', raceTime, value: EVENT_END + 86400000 }))
    await sleep(800)

    expect(mockApi.updateEvent).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  // User-facing problem: the race time jumps back to the old value with no
  // explanation when saving fails.
  test('a failed race-time save reverts the time and shows an error snackbar', async () => {
    mockApi.updateRaceTime = fail()
    const dispatch = startSaga()

    dispatch(setRaceTime({ race: 'R2', raceTime, value: EVENT_START + 7200000 }))
    await sleep(50)

    const updates = actionsOfType('UPDATE_RACE_TIME')
    expect(updates[updates.length - 1].payload).toEqual({ [`${LEADERBOARD}-R2`]: raceTime })
    expect(Snackbar.show).toHaveBeenCalled()
  })

  // User-facing problem: the previous race keeps tracking into the new race
  // (end-of-tracking not set) and the user is not told.
  test('a failed end-of-tracking update for the previous race shows an error snackbar', async () => {
    mockApi.setTrackingTimes = fail()
    const dispatch = startSaga()

    dispatch(setRaceTime({ race: 'R2', raceTime, value: EVENT_START + 7200000 }))
    await sleep(50)

    expect(mockApi.updateRaceTime).toHaveBeenCalled()
    expect(mockApi.setTrackingTimes).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })
})

describe('background refresh of race times and courses', () => {
  // User-facing problem: an empty 200 response ('') overwrites a race's
  // start time in the store, and identical results are all attributed to the
  // first race that produced them.
  test("race times: '' results are ignored and each result is stored under its own race", async () => {
    const shared = { startTimeAsMillis: 123 }
    const byRace: any = { R1: '', R2: shared, R3: shared }
    mockApi.requestRaceTime = jest.fn(async (_lb: string, race: string) => byRace[race])
    const dispatch = startSaga(['R1', 'R2', 'R3'])

    dispatch(fetchRacesTimesForEvent(session))
    await sleep(50)

    const written = Object.assign({}, ...actionsOfType('UPDATE_RACE_TIME').map(a => a.payload))
    expect(written).toEqual({
      [`${LEADERBOARD}-R2`]: shared,
      [`${LEADERBOARD}-R3`]: shared,
    })
  })

  test("courses: '' results are ignored and each course is loaded for its own race", async () => {
    const shared = { waypoints: [] }
    const byRace: any = { R1: '', R2: shared, R3: shared }
    mockApi.requestCourse = jest.fn(async (_regatta: string, race: string) => byRace[race])
    const dispatch = startSaga(['R1', 'R2', 'R3'])

    dispatch(fetchCoursesForEvent(session))
    await sleep(50)

    const loaded = actionsOfType('LOAD_COURSE').map(a => a.payload)
    expect(loaded).toHaveLength(2)
    expect(loaded).toEqual(expect.arrayContaining([
      { raceId: `${REGATTA} - R2`, course: shared },
      { raceId: `${REGATTA} - R3`, course: shared },
    ]))
  })
})
