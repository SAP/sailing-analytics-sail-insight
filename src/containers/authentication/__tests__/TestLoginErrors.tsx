/**
 * Desired error behavior of the Login screen.
 *
 * Contracts:
 * - helpers/texts exports `getLoginErrorMessage(err): string`:
 *     AuthException / ApiException with status 401 -> I18n 'error_login_incorrect'
 *     anything else -> getErrorDisplayMessage(err) (network/timeout -> 'error_network_required_alert',
 *     5xx -> 'error_server_busy', ...)
 *   The Login screen uses it for the message it renders after a failed login.
 * - The Login screen renders its `error` state (e.g. the offline message
 *   'error_network_required_snackbar') as visible text.
 */
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import ApiException from 'api/ApiException'
import AuthException from 'api/AuthException'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import I18n from 'i18n'
import * as texts from 'helpers/texts'

declare var beforeAll: any
declare var describe: any
declare var test: any
declare var expect: any

const mockLogin = jest.fn()
jest.mock('actions/auth', () => ({ login: (...args: any[]) => () => mockLogin(...args) }))
jest.mock('actions/user', () => ({ fetchUserInfo: () => ({ type: 'X' }), syncEventList: () => ({ type: 'X' }) }))
jest.mock('actions/inventory', () => ({ loadMarkProperties: () => ({ type: 'X' }) }))
jest.mock('react-native-linear-gradient', () => ({ children }: any) => children)
jest.mock('components/ScrollContentView', () => ({ children }: any) => children)
jest.mock('components/EulaLink', () => () => null)
jest.mock('components/TextInput', () => (props: any) => {
  const { createElement } = require('react')
  return createElement('MockTextInput', { ...props, inputRef: undefined })
})
jest.mock('components/TextButton', () => (props: any) => {
  const { createElement } = require('react')
  return createElement('MockTextButton', props, props.children)
})

// eslint-disable-next-line import/first
import Login from '../Login'

beforeAll(() => {
  I18n.locale = 'en'
})

const renderLogin = (isConnected: boolean) => {
  const store = createStore(() => ({ network: { isConnected } }))
  let renderer: any
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}><Login navigation={{ reset: jest.fn(), navigate: jest.fn() }} /></Provider>,
    )
  })
  return renderer
}

const fillAndSubmit = async (renderer: any) => {
  const [username, password] = renderer.root.findAllByType('MockTextInput')
  act(() => { username.props.onChangeText('user') })
  act(() => { password.props.onChangeText('pw') })
  const submit = renderer.root.findAll((n: any) => n.type === 'MockTextButton' && n.props.testID === 'e2e-login-submit')[0]
  await act(async () => { await submit.props.onPress() })
}

const renderedText = (renderer: any) => JSON.stringify(renderer.toJSON())

describe('getLoginErrorMessage', () => {
  // User impact: on a timeout or server outage users are told their password is
  // wrong and start resetting a correct password.
})

describe('Login screen', () => {
  test('a login timeout is NOT shown as "username or password incorrect"', async () => {
    mockLogin.mockRejectedValueOnce(NetworkTimeoutException.create('Server request timeout'))
    const renderer = renderLogin(true)

    await fillAndSubmit(renderer)

    const output = renderedText(renderer)
    expect(output).not.toContain(I18n.t('error_login_incorrect'))
    expect(output).toContain(I18n.t('error_network_required_alert'))
  })

  test('wrong credentials (401) still show "username or password incorrect"', async () => {
    mockLogin.mockRejectedValueOnce(AuthException.create('Unauthorized'))
    const renderer = renderLogin(true)

    await fillAndSubmit(renderer)

    expect(renderedText(renderer)).toContain(I18n.t('error_login_incorrect'))
  })

  // User impact: offline, tapping LOGIN does nothing visible.
  test('submitting while offline renders the network-required message', async () => {
    const renderer = renderLogin(false)

    await fillAndSubmit(renderer)

    expect(mockLogin).not.toHaveBeenCalled()
    expect(renderedText(renderer)).toContain(I18n.t('error_network_required_snackbar'))
  })
})
