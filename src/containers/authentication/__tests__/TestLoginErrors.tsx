import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import NetworkTimeoutException from 'api/NetworkTimeoutException'

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

const renderLogin = () => {
  const store = createStore(() => ({ network: { isConnected: true } }), applyMiddleware(thunk))
  let renderer: any
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}><Login navigation={{ reset: jest.fn(), navigate: jest.fn() }} /></Provider>,
    )
  })
  return renderer
}

test('keyboard and button submission share one pending login and allow retry after rejection', async () => {
  let rejectRequest: any
  mockLogin.mockReturnValueOnce(new Promise((_, reject) => { rejectRequest = reject }))
  mockLogin.mockRejectedValueOnce(NetworkTimeoutException.create('Server request timeout'))
  const renderer = renderLogin()
  const [username, password] = renderer.root.findAllByType('MockTextInput')
  act(() => { username.props.onChangeText('user'); password.props.onChangeText('pw') })
  const submit = renderer.root.findAll((n: any) => n.type === 'MockTextButton' && n.props.children === 'LOGIN')[0]
  expect(submit).toBeDefined()
  let first: any
  act(() => {
    first = password.props.onSubmitEditing()
    submit.props.onPress()
  })
  const initialCalls = mockLogin.mock.calls.length
  const pendingLoading = submit.props.isLoading
  await act(async () => { rejectRequest(NetworkTimeoutException.create('Server request timeout')); await first })
  expect(initialCalls).toBe(1)
  expect(pendingLoading).toBe(true)
  expect(submit.props.isLoading).toBe(false)
  await act(async () => { await password.props.onSubmitEditing() })
  expect(mockLogin).toHaveBeenCalledTimes(2)
  expect(submit.props.isLoading).toBe(false)
  act(() => renderer.unmount())
})
