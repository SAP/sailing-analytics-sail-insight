/**
 * Desired behavior of the auth thunks (actions/auth.ts).
 *
 * Contracts:
 * - login/register: if anything fails after the access token arrived (e.g. fetching
 *   the current user), the token must not stay in the store (auth state ends up
 *   with accessToken === null) and the thunk rejects.
 * - requestPasswordReset(usernameOrEmail) is a thunk: `dispatch => Promise` that
 *   resolves when the API resolved and rejects with the API error otherwise.
 * - logout() stops native location tracking (LocationService.stop) and clears the
 *   LocationService access token (LocationService.setAccessToken('')).
 */
import authReducer from 'reducers/AuthReducer'

declare var describe: any
declare var test: any
declare var expect: any
declare var beforeEach: any

const mockAuthApi = {
  accessToken: jest.fn(),
  register: jest.fn(),
  user: jest.fn(),
  requestPasswordReset: jest.fn(),
}
jest.mock('api', () => ({ authApi: () => mockAuthApi, dataApi: () => ({}) }))
jest.mock('services/LocationService', () => ({
  setAccessToken: jest.fn(() => Promise.resolve()),
  stop: jest.fn(() => Promise.resolve()),
}))
jest.mock('helpers/network', () => ({ showNetworkRequiredSnackbarMessage: jest.fn() }))

import * as LocationService from 'services/LocationService'
import { login, logout, register, requestPasswordReset } from '../auth'

// Minimal thunk-aware fake store around the real auth reducer.
const createFakeStore = () => {
  let state: any = { auth: authReducer(undefined, { type: '@@INIT' }) }
  const dispatch: any = (action: any) => {
    if (typeof action === 'function') {
      return action(dispatch, () => state)
    }
    if (action === null || typeof action !== 'object') {
      throw new Error('Actions must be plain objects')
    }
    state = { auth: authReducer(state.auth, action) }
    return action
  }
  return { dispatch, getState: () => state }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('half-logged-in state', () => {
  // User impact: the login screen shows an error, but the app silently keeps a
  // valid token -> on next start the user is "logged in" without a user profile.
  test('login: when fetching the user fails after the token arrived, the token is not kept', async () => {
    mockAuthApi.accessToken.mockResolvedValue({ accessToken: 'secret-token' })
    mockAuthApi.user.mockRejectedValue(new TypeError('Network request failed'))
    const store = createFakeStore()

    await expect(store.dispatch(login('user', 'pw'))).rejects.toBeTruthy()

    expect(store.getState().auth.accessToken).toBeNull()
  })

  test('register: when fetching the user fails after the token arrived, the token is not kept', async () => {
    mockAuthApi.register.mockResolvedValue({ accessToken: 'secret-token' })
    mockAuthApi.user.mockRejectedValue(new TypeError('Network request failed'))
    const store = createFakeStore()

    await expect(store.dispatch(register('user', 'a@b.de', 'pw'))).rejects.toBeTruthy()

    expect(store.getState().auth.accessToken).toBeNull()
  })
})

describe('requestPasswordReset', () => {
  // User impact: dispatching a bare Promise throws "Actions must be plain objects",
  // so the screen cannot tell success from failure.
  test('is a thunk that resolves after the API resolved', async () => {
    mockAuthApi.requestPasswordReset.mockResolvedValue(undefined)
    const store = createFakeStore()

    const action: any = requestPasswordReset('a@b.de')
    expect(typeof action).toBe('function')
    await expect(store.dispatch(action)).resolves.toBeUndefined()
    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalledWith('', 'a@b.de')
  })

  test('rejects with the API error when the request fails', async () => {
    const error = new TypeError('Network request failed')
    mockAuthApi.requestPasswordReset.mockRejectedValue(error)
    const store = createFakeStore()

    const action: any = requestPasswordReset('someuser')
    // today this is a bare (rejecting) Promise; keep it from crashing the runner
    if (action && typeof action.catch === 'function') action.catch(() => undefined)
    expect(typeof action).toBe('function')
    await expect(store.dispatch(action)).rejects.toBe(error)
  })
})

describe('logout', () => {
  // User impact: after logout the phone keeps tracking and uploading GPS fixes
  // with the previous user's token.
  test('stops native location tracking and clears the tracking access token', async () => {
    const store = createFakeStore()

    await store.dispatch(logout())

    expect(LocationService.stop).toHaveBeenCalled()
    expect(LocationService.setAccessToken).toHaveBeenCalledWith('')
  })
})
