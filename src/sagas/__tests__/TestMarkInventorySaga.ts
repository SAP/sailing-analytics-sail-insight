/**
 * Specification tests for loading the mark inventory (src/sagas/InventorySaga.ts).
 * Expected to fail until the saga is fixed.
 *
 * Contracts assumed:
 *  - The LOAD_MARK_PROPERTIES action may be dispatched without a payload (as
 *    MarkInventory does with `loadMarkProperties()`); the saga must then behave
 *    like the default (create missing default mark properties).
 *  - A 200 response with an empty body ('' from api/handler jsonData) is an
 *    invalid response, not an empty inventory: nothing must be created.
 */
import { runSaga, stdChannel } from 'redux-saga'
import watchInventory from '../InventorySaga'
import { loadMarkProperties as loadMarkPropertiesAction } from 'actions/inventory'

declare var describe: any
declare var test: any
declare var expect: any
declare var beforeEach: any
declare var afterEach: any

const mockApi: any = {
  requestMarkProperties: jest.fn(),
  createMarkProperties: jest.fn(),
  removeMarkProperty: jest.fn(),
}

const mockShowErrorAlert = jest.fn()
jest.mock('helpers/errorAlert', () => ({ showErrorAlert: (...a: any[]) => mockShowErrorAlert(...a) }))
jest.mock('api', () => ({ dataApi: () => mockApi }))
jest.mock('selectors/auth', () => ({
  ...jest.requireActual('selectors/auth'),
  isLoggedIn: () => true,
}))
jest.mock('selectors/settings', () => ({
  ...jest.requireActual('selectors/settings'),
  getServerUrlSetting: () => 'https://server.test',
}))

const flush = async (times = 10) => {
  for (let i = 0; i < times; i++) {
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

let dispatched: any[]
let sagaErrors: any[]
let channel: any
let task: any

const dispatch = (action: any) => {
  dispatched.push(action)
  channel.put(action)
}

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  mockShowErrorAlert.mockReset()
  Object.keys(mockApi).forEach(k => mockApi[k].mockReset())
  mockApi.createMarkProperties.mockImplementation((mp: any) => Promise.resolve({ ...mp, id: `id-${mp.name}` }))
  dispatched = []
  sagaErrors = []
  channel = stdChannel()
  task = runSaga({
    channel,
    dispatch,
    getState: () => ({}),
    onError: (e: any) => { sagaErrors.push(e) },
  }, watchInventory)
})

afterEach(() => {
  task && task.isRunning() && task.cancel()
  jest.restoreAllMocks()
})

describe('loading the mark inventory', () => {
  // User impact: opening the Mark Inventory screen with an empty inventory
  // crashed the inventory saga (TypeError on payload) so the default marks
  // were never created and later inventory loads stopped working.
  test('works when the action is dispatched without a payload (as the Mark Inventory screen does)', async () => {
    mockApi.requestMarkProperties.mockResolvedValue({ entities: { markProperties: {} }, result: [] })

    dispatch(loadMarkPropertiesAction())
    await flush()

    expect(sagaErrors).toEqual([])
    expect(mockApi.createMarkProperties).toHaveBeenCalled()
  })

  // User impact: a backend hiccup returning 200 with an empty body made the
  // app POST all nine default mark properties again -> duplicate marks.
  test('treats an empty response body as invalid and does not create any default mark properties', async () => {
    mockApi.requestMarkProperties.mockResolvedValue('')

    dispatch(loadMarkPropertiesAction({ createMissingDefaultMarkProperties: true }))
    await flush()

    expect(sagaErrors).toEqual([])
    expect(mockApi.createMarkProperties).not.toHaveBeenCalled()
  })

  test('still creates only the missing defaults for a valid inventory (regression guard)', async () => {
    mockApi.requestMarkProperties.mockResolvedValue({
      entities: { markProperties: { a: { id: 'a', name: 'Start/Finish Pin' } } },
      result: ['a'],
    })

    dispatch(loadMarkPropertiesAction({ createMissingDefaultMarkProperties: true }))
    await flush()

    const createdNames = mockApi.createMarkProperties.mock.calls.map((c: any[]) => c[0].name)
    expect(createdNames).not.toContain('Start/Finish Pin')
    expect(createdNames.length).toBe(8)
  })
})

describe('deleting a mark property', () => {
  const mark = { id: 'm1', name: 'Windward Mark' }

  test('restores the mark locally when the server refuses the deletion', async () => {
    mockApi.removeMarkProperty.mockRejectedValue(new Error('mark is used in a course'))

    dispatch({ type: 'REMOVE_ENTITY', payload: { entityType: 'markProperties', id: 'm1', entity: mark } })
    await flush()

    expect(sagaErrors).toEqual([])
    const restore = dispatched.find((a: any) => a.type === 'RECEIVE_ENTITIES')
    expect(restore.payload.entities.markProperties).toEqual({ m1: mark })
    expect(mockShowErrorAlert).toHaveBeenCalledTimes(1)
  })

  test('does not restore or alert when the server deletes it', async () => {
    mockApi.removeMarkProperty.mockResolvedValue({})

    dispatch({ type: 'REMOVE_ENTITY', payload: { entityType: 'markProperties', id: 'm1', entity: mark } })
    await flush()

    expect(dispatched.find((a: any) => a.type === 'RECEIVE_ENTITIES')).toBeUndefined()
    expect(mockShowErrorAlert).not.toHaveBeenCalled()
  })
})
