/**
 * Desired behavior of the PasswordReset screen.
 *
 * The generic "check your inbox" success alert is intentionally also shown when
 * the server rejects the request (e.g. unknown user, 4xx) - no account
 * enumeration. But it must NOT be shown when the request never reached the
 * server or the server is down:
 *   - offline (network.isConnected === false): no request, network message
 *   - TypeError('Network request failed') / NetworkTimeoutException: network message
 *   - 5xx: server-busy message ('error_server_busy')
 * "Shown" = rendered on screen, or passed to Alert.alert, or to Snackbar.show.
 * The success alert appears only after the request settled (requires
 * requestPasswordReset to be a real thunk whose promise the screen awaits).
 */
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import ApiException from 'api/ApiException'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import I18n from 'i18n'

declare var beforeAll: any
declare var beforeEach: any
declare var describe: any
declare var test: any
declare var expect: any

const mockAuthApi = { requestPasswordReset: jest.fn() }
jest.mock('api', () => ({ authApi: () => mockAuthApi, dataApi: () => ({}) }))
jest.mock('services/LocationService', () => ({ setAccessToken: jest.fn(), stop: jest.fn() }))
jest.mock('react-native-linear-gradient', () => ({ children }: any) => children)
jest.mock('components/ScrollContentView', () => ({ children }: any) => children)
jest.mock('components/TextInput', () => (props: any) => {
  const { createElement } = require('react')
  return createElement('MockTextInput', { ...props, inputRef: undefined })
})
jest.mock('components/TextButton', () => (props: any) => {
  const { createElement } = require('react')
  return createElement('MockTextButton', props, props.children)
})

// eslint-disable-next-line import/first
import PasswordReset from '../PasswordReset'

beforeAll(() => {
  I18n.locale = 'en'
})

let alertSpy: any
beforeEach(() => {
  jest.clearAllMocks()
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
})

const SUCCESS_TITLE = () => I18n.t('text_passwort_reset_confirm_title')

const successAlertShown = () => alertSpy.mock.calls.some((c: any[]) => c[0] === SUCCESS_TITLE())

const messageShown = (renderer: any, message: string) =>
  JSON.stringify(renderer.toJSON()).includes(message) ||
  alertSpy.mock.calls.some((c: any[]) => c.slice(0, 2).includes(message)) ||
  (Snackbar.show as any).mock.calls.some((c: any[]) => c[0] && c[0].text === message)

const render = (isConnected = true) => {
  const store = createStore((s: any = { network: { isConnected } }) => s, applyMiddleware(thunk))
  let renderer: any
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}><PasswordReset navigation={{ goBack: jest.fn() }} /></Provider>,
    )
  })
  return renderer
}

const submit = async (renderer: any, value = 'someone@example.com') => {
  const input = renderer.root.findByType('MockTextInput')
  act(() => { input.props.onChangeText(value) })
  const button = renderer.root.findByType('MockTextButton')
  await act(async () => { await button.props.onPress() })
}

describe('PasswordReset screen', () => {
  // User impact: offline users are told "check your inbox" although nothing was sent.
  test('offline: no success alert, network message shown, no request sent', async () => {
    const renderer = render(false)
    await submit(renderer)

    expect(successAlertShown()).toBe(false)
    expect(mockAuthApi.requestPasswordReset).not.toHaveBeenCalled()
    expect(messageShown(renderer, I18n.t('error_network_required_snackbar')) ||
      messageShown(renderer, I18n.t('error_network_required_alert'))).toBe(true)
  })

  test('network failure: no success alert, network message shown', async () => {
    mockAuthApi.requestPasswordReset.mockRejectedValue(new TypeError('Network request failed'))
    const renderer = render()
    await submit(renderer)

    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalled()
    expect(successAlertShown()).toBe(false)
    expect(messageShown(renderer, I18n.t('error_network_required_alert'))).toBe(true)
  })

  test('timeout: no success alert, network message shown', async () => {
    mockAuthApi.requestPasswordReset.mockRejectedValue(NetworkTimeoutException.create('Server request timeout'))
    const renderer = render()
    await submit(renderer)

    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalled()
    expect(successAlertShown()).toBe(false)
    expect(messageShown(renderer, I18n.t('error_network_required_alert'))).toBe(true)
  })

  test('5xx: no success alert, server-busy message shown', async () => {
    mockAuthApi.requestPasswordReset.mockRejectedValue(ApiException.create('x', 503))
    const renderer = render()
    await submit(renderer)

    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalled()
    expect(successAlertShown()).toBe(false)
    expect(messageShown(renderer, I18n.t('error_server_busy'))).toBe(true)
  })

  // Anti-account-enumeration: unknown user still gets the generic confirmation.
  test('4xx (e.g. unknown user): the generic success alert is still shown', async () => {
    mockAuthApi.requestPasswordReset.mockRejectedValue(ApiException.create('x', 404))
    const renderer = render()
    await submit(renderer, 'unknownuser')

    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalledWith('unknownuser', '')
    expect(successAlertShown()).toBe(true)
  })

  test('success alert appears only after the request resolved', async () => {
    let resolveRequest: any
    mockAuthApi.requestPasswordReset.mockReturnValue(new Promise(resolve => { resolveRequest = resolve }))
    const renderer = render()

    const input = renderer.root.findByType('MockTextInput')
    act(() => { input.props.onChangeText('someone@example.com') })
    const button = renderer.root.findByType('MockTextButton')
    let pressed: any
    await act(async () => { pressed = button.props.onPress() })

    expect(mockAuthApi.requestPasswordReset).toHaveBeenCalledWith('', 'someone@example.com')
    expect(successAlertShown()).toBe(false)

    await act(async () => { resolveRequest(undefined); await pressed })
    expect(successAlertShown()).toBe(true)
  })
})
