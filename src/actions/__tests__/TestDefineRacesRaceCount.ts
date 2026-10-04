/**
 * Define Races screen: changing the number of races.
 *
 * Drives the real `updateEventSettings` thunk (actions/events.ts, the handler of
 * the race-count picker in RaceDetails) together with the real events saga
 * (watchEvents) against a fake server that keeps its own list of race columns.
 *
 * Contracts assumed by these tests:
 *  - The CONFIRMATION SEAM for reducing the race count is the
 *    `updateEventSettings` thunk (or anything it triggers): it must call
 *    `Alert.alert(title, message, buttons)` where `buttons` contains one button
 *    with `style: 'destructive'` (confirm) and one with `style: 'cancel'`.
 *    No `removeRaceColumn` API call may happen before the destructive button
 *    is pressed. Increasing the count needs no confirmation.
 *  - Errors are surfaced with `Snackbar.show` (any text), e.g. via
 *    `showSaveFailedSnackbarMessage` from helpers/network.
 *  - The API is reached through `dataApi(serverUrl)` from 'api'; only the
 *    methods below are faked (addRaceColumns, removeRaceColumn, requestRegatta,
 *    denoteRaceForTracking, startTracking). A fix may additionally re-read the
 *    regatta via `requestRegatta` before computing the diff.
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

const NETWORK_DELAY = 30
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const settle = () => sleep(600)

const mockServer: any = {
  races: [] as string[],
  failRemove: [] as string[],
  failDenote: false,
  failStartTracking: false,
}

const mockApi: any = {
  addRaceColumns: jest.fn(async (_regatta: string, data: any) => {
    await sleep(NETWORK_DELAY)
    const added = []
    for (let i = 0; i < data.numberofraces; i++) {
      const name = `R${mockServer.races.length + 1}`
      mockServer.races.push(name)
      added.push({ seriesname: 'Default', racename: name })
    }
    return added
  }),
  removeRaceColumn: jest.fn(async (_regatta: string, race: string) => {
    await sleep(NETWORK_DELAY)
    if (mockServer.failRemove.includes(race) || !mockServer.races.includes(race)) {
      throw new Error(`cannot remove ${race}`)
    }
    mockServer.races = mockServer.races.filter((r: string) => r !== race)
    return {}
  }),
  requestRegatta: jest.fn(async (name: string) => {
    await sleep(NETWORK_DELAY)
    return {
      result: name,
      entities: { regatta: { [name]: { name, series: [{ name: 'Default', races: [...mockServer.races] }] } } },
    }
  }),
  denoteRaceForTracking: jest.fn(async () => {
    await sleep(5)
    if (mockServer.failDenote) { throw new Error('denote failed') }
    return {}
  }),
  startTracking: jest.fn(async () => {
    await sleep(5)
    if (mockServer.failStartTracking) { throw new Error('start tracking failed') }
    return {}
  }),
}

jest.mock('api', () => ({
  ...jest.requireActual('api'),
  dataApi: () => mockApi,
  selfTrackingApi: () => mockApi,
}))

// updateCheckIn is a thunk touching persisted check-in storage; keep it a plain action.
jest.mock('actions/checkIn', () => ({
  ...jest.requireActual('actions/checkIn'),
  updateCheckIn: (payload: any) => ({ type: 'TEST_UPDATE_CHECK_IN', payload }),
}))

// eslint-disable-next-line import/first
import { updateEventSettings } from 'actions/events'
// eslint-disable-next-line import/first
import watchEvents from 'sagas/EventsSaga'

const session = {
  eventId: 'ev1',
  regattaName: REGATTA,
  leaderboardName: LEADERBOARD,
  serverUrl: SERVER,
  trackPrefix: 'R',
}

const regattaEntity = (races: string[]) =>
  ({ name: REGATTA, series: [{ name: 'Default', races: [...races] }] })

function createStore({ tracking = false } = {}) {
  let state: any = {
    entities: {
      regatta: { [REGATTA]: regattaEntity(mockServer.races) },
      leaderboard: tracking
        ? { [LEADERBOARD]: { name: LEADERBOARD, trackedRacesInfo: [{ fleets: [{ trackedRace: { status: 'TRACKING' } }] }] } }
        : {},
    },
    events: { selectedEvent: 'ev1', all: { ev1: { id: 'ev1' } } },
    checkIn: { active: { [LEADERBOARD]: session } },
    auth: { user: { username: 'tester' } },
  }
  const channel = stdChannel()
  const getState = () => state
  const reduce = (action: any) => {
    if (action.type === 'RECEIVE_ENTITIES' && action.payload && action.payload.entities) {
      const entities = { ...state.entities }
      Object.keys(action.payload.entities).forEach(type => {
        entities[type] = { ...(entities[type] || {}), ...action.payload.entities[type] }
      })
      state = { ...state, entities }
    }
  }
  const dispatch: any = (action: any) => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    reduce(action)
    channel.put(action)
    return action
  }
  const task = runSaga({ channel, dispatch, getState }, watchEvents)
  return { dispatch, getState, task }
}

const lastAlertButtons = () => {
  const calls = (Alert.alert as any).mock.calls
  const last = calls[calls.length - 1]
  return (last && last[2]) || []
}

let alertSpy: any
let store: any

beforeEach(() => {
  jest.clearAllMocks()
  mockServer.failRemove = []
  mockServer.failDenote = false
  mockServer.failStartTracking = false
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  if (store) { store.task.cancel() }
  store = undefined
  if (alertSpy) { alertSpy.mockRestore() }
  alertSpy = undefined
  ;(console.warn as any).mockRestore()
})

// Presses the destructive (confirm) button synchronously, if one is offered.
const autoConfirmAlerts = () => {
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_t: any, _m: any, buttons: any[] = []) => {
    const confirm = buttons.find(b => b && b.style === 'destructive')
    if (confirm && confirm.onPress) { confirm.onPress() }
  })
}

describe('race count: rapid successive changes', () => {
  // User-facing problem: changing the picker again while the first change is
  // still being saved computes the diff from the stale race list, so the
  // event ends up with a different number of races than the picker shows.
  test('increasing 3 -> 5 and then -> 6 while the first change is in flight ends with 6 races on the server', async () => {
    mockServer.races = ['R1', 'R2', 'R3']
    autoConfirmAlerts()
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 5 }))
    await sleep(5)
    store.dispatch(updateEventSettings(session, { numberOfRaces: 6 }))
    await settle()

    expect(mockServer.races).toHaveLength(6)
  })

  test('reducing 5 -> 3 and then -> 4 while the first change is in flight ends with 4 races on the server', async () => {
    mockServer.races = ['R1', 'R2', 'R3', 'R4', 'R5']
    autoConfirmAlerts()
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 3 }))
    await sleep(5)
    store.dispatch(updateEventSettings(session, { numberOfRaces: 4 }))
    await settle()

    expect(mockServer.races).toHaveLength(4)
  })
})

describe('race count: reducing requires confirmation', () => {
  // User-facing problem: lowering the picker deletes races (and their race
  // logs/tracking data) on the server immediately, without asking.
  test('reducing the race count asks for a destructive confirmation and removes nothing before it is confirmed', async () => {
    mockServer.races = ['R1', 'R2', 'R3', 'R4', 'R5']
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 3 }))
    await settle()

    expect(Alert.alert).toHaveBeenCalled()
    expect(lastAlertButtons().some((b: any) => b.style === 'destructive')).toBe(true)
    expect(mockApi.removeRaceColumn).not.toHaveBeenCalled()
  })

  test('cancelling the confirmation keeps all races', async () => {
    mockServer.races = ['R1', 'R2', 'R3', 'R4', 'R5']
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 3 }))
    await sleep(50)
    expect(Alert.alert).toHaveBeenCalled()
    const cancel = lastAlertButtons().find((b: any) => b.style === 'cancel')
    expect(cancel).toBeDefined()
    if (cancel.onPress) { cancel.onPress() }
    await settle()

    expect(mockApi.removeRaceColumn).not.toHaveBeenCalled()
    expect(mockServer.races).toHaveLength(5)
  })

  test('confirming the destructive option removes the surplus races', async () => {
    mockServer.races = ['R1', 'R2', 'R3', 'R4', 'R5']
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 3 }))
    await sleep(50)
    expect(Alert.alert).toHaveBeenCalled()
    lastAlertButtons().find((b: any) => b.style === 'destructive').onPress()
    await settle()

    expect(mockServer.races).toEqual(['R1', 'R2', 'R3'])
  })

  // Regression guard (passes today): adding races must stay confirmation-free.
  test('increasing the race count does not ask for confirmation', async () => {
    mockServer.races = ['R1', 'R2', 'R3']
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 4 }))
    await settle()

    expect(Alert.alert).not.toHaveBeenCalled()
    expect(mockServer.races).toHaveLength(4)
  })
})

describe('race count: failures are reported', () => {
  // User-facing problem: when some race columns could not be removed the
  // screen silently shows a different count than requested.
  test('a failed removal of one of several races shows an error snackbar', async () => {
    mockServer.races = ['R1', 'R2', 'R3', 'R4', 'R5']
    mockServer.failRemove = ['R5']
    autoConfirmAlerts()
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 3 }))
    await settle()

    expect(mockApi.removeRaceColumn).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  // User-facing problem: new races that could not be denoted for tracking
  // will never be tracked, but the user is not told.
  test('a failed denote-for-tracking of added races shows an error snackbar', async () => {
    mockServer.races = ['R1', 'R2', 'R3']
    mockServer.failDenote = true
    store = createStore()

    store.dispatch(updateEventSettings(session, { numberOfRaces: 5 }))
    await settle()

    expect(mockApi.denoteRaceForTracking).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })

  // User-facing problem: while the event is tracking, newly added races that
  // failed to start tracking record nothing, silently.
  test('a failed start-tracking of added races during a tracking event shows an error snackbar', async () => {
    mockServer.races = ['R1', 'R2', 'R3']
    mockServer.failStartTracking = true
    store = createStore({ tracking: true })

    store.dispatch(updateEventSettings(session, { numberOfRaces: 5 }))
    await settle()

    expect(mockApi.startTracking).toHaveBeenCalled()
    expect(Snackbar.show).toHaveBeenCalled()
  })
})
