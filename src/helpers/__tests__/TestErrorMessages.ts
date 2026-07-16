import ApiException from 'api/ApiException'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import CheckInException from 'services/CheckInService/CheckInException'

import I18n from 'i18n'
import { getErrorDisplayMessage, getInvitationErrorMessage } from '../texts'

declare var beforeAll: any
declare var test: any
declare var expect: any

beforeAll(() => {
  I18n.locale = 'en'
})

test('maps 404 to a not-found message instead of "Oops (404)"', () => {
  const message = getErrorDisplayMessage(ApiException.create('irrelevant server text', 404))
  expect(message).toBe(I18n.t('error_not_found_on_server'))
  expect(message).not.toContain('404')
})

test('maps 500/502/503/504 to the server-busy message (bugzilla 6206)', () => {
  for (const status of [500, 502, 503, 504]) {
    const message = getErrorDisplayMessage(ApiException.create('irrelevant server text', status))
    expect(message).toBe(I18n.t('error_server_busy'))
    expect(message).not.toContain(String(status))
  }
})

test('maps timeouts and network-level fetch failures to the network alert', () => {
  expect(getErrorDisplayMessage(NetworkTimeoutException.create('Server request timeout')))
    .toBe(I18n.t('error_network_required_alert'))
  expect(getErrorDisplayMessage(new TypeError('Network request failed')))
    .toBe(I18n.t('error_network_required_alert'))
})

test('keeps the existing 401/403/412 mappings unchanged', () => {
  expect(getErrorDisplayMessage(ApiException.create('x', 401)))
    .toBe(I18n.t('error_unauthorized'))
  expect(getErrorDisplayMessage(ApiException.create('x', 403)))
    .toBe(I18n.t('error_forbidden'))
  expect(getErrorDisplayMessage(ApiException.create('The device is already registered here', 403)))
    .toBe(I18n.t('error_device_already_exists'))
  expect(getErrorDisplayMessage(ApiException.create('this user already exists', 412)))
    .toBe(I18n.t('error_user_already_exists'))
})

test('still resolves mapped server errorCodeNames', () => {
  const exception = ApiException.create('x', 400, JSON.stringify({ errorCodeName: 'NO_VENUE' }))
  expect(getErrorDisplayMessage(exception)).toBe(I18n.t('error_no_venue'))
})

test('unmapped server errorCodeName falls through instead of showing "[missing ...]"', () => {
  const exception = ApiException.create('x', 404, JSON.stringify({ errorCodeName: 'SOME_FUTURE_CODE' }))
  const message = getErrorDisplayMessage(exception)
  expect(message).not.toContain('missing')
  expect(message).toBe(I18n.t('error_not_found_on_server'))
})

test('unknown errors still fall back to the generic message', () => {
  expect(getErrorDisplayMessage(new Error('boom'))).toBe(I18n.t('error_unknown'))
  expect(getErrorDisplayMessage(undefined)).toBe(I18n.t('error_unknown'))
})

test('invitation surfaces: CheckInException and 404 mean "invalid invitation"', () => {
  expect(getInvitationErrorMessage(new CheckInException('could not extract data.')))
    .toBe(I18n.t('error_invalid_invitation'))
  expect(getInvitationErrorMessage(ApiException.create('x', 404)))
    .toBe(I18n.t('error_invalid_invitation'))
  // everything else keeps the central mapping
  expect(getInvitationErrorMessage(ApiException.create('x', 503)))
    .toBe(I18n.t('error_server_busy'))
  expect(getInvitationErrorMessage(NetworkTimeoutException.create('Server request timeout')))
    .toBe(I18n.t('error_network_required_alert'))
})
