/**
 * Create Event: a failure AFTER the server created the event must say so.
 *
 * User-facing problem: `createEventActionQueue` (src/actions/events.ts) first
 * POSTs createEvent (the event now exists on the server), then runs
 * `collectCheckInData` (fetchEvent / requestLeaderboardV2 / fetchRegatta ...).
 * If one of those follow-up requests fails, the screen
 * (src/containers/session/EventCreation/index.tsx) shows a plain
 * "something went wrong" error, so the user taps Create again and gets
 * "already exists" — or ends up with duplicate events.
 *
 * Contract for the fix:
 * - New i18n key `error_event_created_setup_incomplete` in
 *   src/i18n/translations/en.json, e.g. "The event was created, but could not be
 *   fully set up. Please do not create it again – open it from the list instead."
 * - When the createEvent POST succeeded but a later step of the queue fails,
 *   `createEventActionQueue(...)(dispatch).execute()` rejects with an error for
 *   which `getErrorDisplayMessage(error)` (src/helpers/texts.ts) returns
 *   I18n.t('error_event_created_setup_incomplete'). How the error is typed is
 *   up to the fixer (e.g. an `EventCreatedSetupIncompleteException` recognised
 *   by getErrorDisplayMessage, or a flag/property on the thrown error).
 * - When the createEvent POST itself fails, the error is surfaced as before
 *   (NOT the setup-incomplete message).
 */
import ApiException from 'api/ApiException'

const mockApi = {
  createEvent: jest.fn(),
  requestEvent: jest.fn(),
  requestLeaderboardV2: jest.fn(),
  requestRegatta: jest.fn(),
  requestRaces: jest.fn(),
  requestRace: jest.fn(),
  requestCompetitor: jest.fn(),
  requestMark: jest.fn(),
  requestBoat: jest.fn(),
  updateEventInventory: jest.fn(),
}

// dataApi and selfTrackingApi are both the `resources` factory
jest.mock('api/endpoints/resources', () => ({
  __esModule: true,
  default: jest.fn(() => mockApi),
}))

jest.mock('api/config', () => ({
  ...jest.requireActual('api/config'),
  getApiServerUrl: () => 'https://example.org',
}))

// eslint-disable-next-line import/first
import { createEventActionQueue } from 'actions/events'
// eslint-disable-next-line import/first
import { getErrorDisplayMessage } from 'helpers/texts'
// eslint-disable-next-line import/first
import I18n from 'i18n'
// eslint-disable-next-line import/first
import { MISSING_PREFIX } from 'i18n/utils'
// eslint-disable-next-line import/first
import { RegattaType } from 'models/EventCreationData'

declare var beforeAll: any
declare var beforeEach: any
declare var test: any
declare var expect: any

const moment = require('moment')

const eventData = {
  name: 'My regatta',
  location: 'Kiel',
  regattaType: RegattaType.OneDesign,
  boatClass: '49er',
  dateFrom: moment().startOf('day'),
  dateTo: moment().endOf('day'),
  numberOfRaces: 3,
  discards: [],
}

const createdResponse = { eventid: 'event-1', leaderboard: 'My regatta', regatta: 'My regatta' }

const makeStore = () => {
  const actions: any[] = []
  const getState = () => ({ network: { isConnected: true } })
  const dispatch: any = (action: any) =>
    typeof action === 'function' ? action(dispatch, getState) : (actions.push(action), action)
  return { actions, dispatch }
}

const runQueue = async () => {
  const { dispatch } = makeStore()
  try {
    await createEventActionQueue({ eventData, navigation: {} })(dispatch).execute()
  } catch (e) {
    return e
  }
  return undefined
}

beforeAll(() => {
  I18n.locale = 'en'
})

beforeEach(() => {
  Object.values(mockApi).forEach((fn: any) => fn.mockReset())
  mockApi.createEvent.mockResolvedValue(createdResponse)
  mockApi.requestEvent.mockResolvedValue(undefined)
  mockApi.requestLeaderboardV2.mockResolvedValue(undefined)
  mockApi.requestRegatta.mockResolvedValue(undefined)
  mockApi.requestRaces.mockResolvedValue(undefined)
})

test('event created but fetching it afterwards fails: user is told the event exists and setup is incomplete', async () => {
  mockApi.requestEvent.mockRejectedValue(ApiException.create('server error', 500))

  const error = await runQueue()

  expect(mockApi.createEvent).toHaveBeenCalledTimes(1)
  expect(error).toBeDefined()
  expect(getErrorDisplayMessage(error)).toBe(I18n.t('error_event_created_setup_incomplete'))
})

test('event created but loading the leaderboard fails: same setup-incomplete message', async () => {
  mockApi.requestLeaderboardV2.mockRejectedValue(ApiException.create('not found', 404))

  const error = await runQueue()

  expect(mockApi.createEvent).toHaveBeenCalledTimes(1)
  expect(error).toBeDefined()
  expect(getErrorDisplayMessage(error)).toBe(I18n.t('error_event_created_setup_incomplete'))
})

// Guard: if the server never created the event, a retry is correct, so the
// normal error mapping must stay.
test('createEvent POST itself fails: normal error, not the setup-incomplete message', async () => {
  mockApi.createEvent.mockRejectedValue(ApiException.create('server error', 503))

  const error = await runQueue()

  expect(error).toBeDefined()
  expect(getErrorDisplayMessage(error)).toBe(I18n.t('error_server_busy'))
  expect(mockApi.requestEvent).not.toHaveBeenCalled()
})
