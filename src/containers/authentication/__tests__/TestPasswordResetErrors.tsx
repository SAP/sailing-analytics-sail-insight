import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { Alert } from 'react-native'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import NetworkTimeoutException from 'api/NetworkTimeoutException'
import I18n from 'i18n'

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

let alertSpy: any
beforeEach(() => {
  jest.clearAllMocks()
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
})

const successAlertShown = () => alertSpy.mock.calls.some((c: any[]) => c[0] === I18n.t('text_passwort_reset_confirm_title'))

const render = () => {
  const store = createStore((s: any = { network: { isConnected: true } }) => s, applyMiddleware(thunk))
  let renderer: any
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}><PasswordReset navigation={{ goBack: jest.fn() }} /></Provider>,
    )
  })
  return renderer
}

test('keyboard and button submission share one pending request and allow retry after rejection', async () => {
  let rejectRequest: any
  mockAuthApi.requestPasswordReset.mockReturnValueOnce(new Promise((_, reject) => { rejectRequest = reject }))
  mockAuthApi.requestPasswordReset.mockResolvedValueOnce(undefined)
  const renderer = render()
  const input = renderer.root.findByType('MockTextInput')
  act(() => { input.props.onChangeText('someone@example.com') })
  const button = renderer.root.findByType('MockTextButton')
  let first: any
  act(() => {
    first = input.props.onSubmitEditing()
    button.props.onPress()
  })
  const initialCalls = mockAuthApi.requestPasswordReset.mock.calls.length
  const pendingLoading = button.props.isLoading
  await act(async () => { rejectRequest(NetworkTimeoutException.create('Server request timeout')); await first })
  expect(initialCalls).toBe(1)
  expect(pendingLoading).toBe(true)
  expect(button.props.isLoading).toBe(false)
  expect(successAlertShown()).toBe(false)
  await act(async () => { await input.props.onSubmitEditing() })
  expect(mockAuthApi.requestPasswordReset).toHaveBeenCalledTimes(2)
  expect(button.props.isLoading).toBe(false)
  expect(successAlertShown()).toBe(true)
  act(() => renderer.unmount())
})
