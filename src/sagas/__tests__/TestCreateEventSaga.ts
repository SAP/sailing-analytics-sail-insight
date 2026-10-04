/**
 * createEvent saga must always release the "creating event" flag.
 *
 * User-facing problem: the CREATE_EVENT saga (src/sagas/EventsSaga.ts) returns
 * early when the action carries no check-in data. That happens when
 * `updateCheckInAndEventInventory` returns undefined because the device went
 * offline mid-creation. The early return does not put
 * `updateCreatingEvent(false)`, so the Create button keeps spinning (and stays
 * disabled) until the app is restarted.
 *
 * Contract for the fix:
 * - Every early exit / failure path of the CREATE_EVENT saga puts
 *   `updateCreatingEvent(false)` (action type UPDATE_CREATING_EVENT, payload false).
 */
import { runSaga, stdChannel } from 'redux-saga'

import { CREATE_EVENT, UPDATE_CREATING_EVENT } from 'actions/events'

jest.mock('api', () => {
  const api = {
    updateRegatta: jest.fn(() => Promise.resolve({})),
    denoteRaceForTracking: jest.fn(() => Promise.resolve({})),
  }
  return { dataApi: jest.fn(() => api), selfTrackingApi: jest.fn(() => api) }
})

// eslint-disable-next-line import/first
import watchEvents from '../EventsSaga'

declare var test: any
declare var expect: any

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

const startSaga = () => {
  const channel = stdChannel()
  const dispatched: any[] = []
  const task = runSaga(
    {
      channel,
      dispatch: (action: any) => { dispatched.push(action); channel.put(action) },
      getState: () => ({}),
    },
    watchEvents,
  )
  return { channel, dispatched, task }
}

test('CREATE_EVENT without check-in data (offline mid-creation) resets isCreatingEvent', async () => {
  const { channel, dispatched, task } = startSaga()

  // What createEventActionQueue dispatches when updateCheckInAndEventInventory
  // returned undefined: createAction(CREATE_EVENT)({ ...undefined, navigation })
  channel.put({ type: CREATE_EVENT, payload: { navigation: {} } })
  await flush()

  expect(dispatched).toContainEqual({ type: UPDATE_CREATING_EVENT, payload: false })
  task.cancel()
})

// Guard: proves the harness reaches the saga — the already-handled failure
// path (regatta settings could not be saved) resets the flag today.
test('CREATE_EVENT whose regatta settings fail to save resets isCreatingEvent', async () => {
  const { dataApi } = require('api')
  dataApi().updateRegatta.mockImplementationOnce(() => Promise.reject(new Error('boom')))
  const { channel, dispatched, task } = startSaga()

  channel.put({
    type: CREATE_EVENT,
    payload: {
      payload: {
        eventId: 'e1', leaderboardName: 'L', regattaName: 'L', secret: 's',
        serverUrl: 'https://example.org', numberOfRaces: 2,
      },
      navigation: {},
    },
  })
  await flush()

  expect(dispatched).toContainEqual({ type: UPDATE_CREATING_EVENT, payload: false })
  task.cancel()
})
