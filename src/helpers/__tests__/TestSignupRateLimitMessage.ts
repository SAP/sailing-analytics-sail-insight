/*
 * Found in the Android E2E run: the backend throttles account creation per IP
 * and answers 412 with
 *   "Client IP 172.18.0.1 locked for user creation: locked until ... next locking duration: 00:02:00.000"
 * The Create Account screen then shows only "Precondition failed." under the
 * user name, which tells the user nothing.
 *
 * Contract: getErrorDisplayMessage maps such a response to the new en.json key
 * `error_signup_rate_limited` (e.g. "Too many accounts were created from this
 * network. Please try again in a few minutes.").
 */
import ApiException from 'api/ApiException'
import I18n from 'i18n'
import { getErrorDisplayMessage } from '../texts'

declare var beforeAll: any
declare var test: any
declare var expect: any

beforeAll(() => {
  I18n.locale = 'en'
})

const LOCKED_BODY = 'Client IP 172.18.0.1 locked for user creation: locked until Sun Oct 04 21:05:35 UTC 2026 (+689ms), next locking duration: 00:02:00.000'

test('a sign-up rate limit (412 "locked for user creation") explains to try again later', () => {
  const message = getErrorDisplayMessage(ApiException.create(LOCKED_BODY, 412, LOCKED_BODY))
  expect(message).not.toBe(I18n.t('error_precondition_failed'))
  expect(message).toBe(I18n.t('error_signup_rate_limited'))
  expect(message).not.toMatch(/missing/i)
})

test('an existing user name (412) still shows the user-exists message', () => {
  const body = 'User with name x already exists'
  expect(getErrorDisplayMessage(ApiException.create(body, 412, body)))
    .not.toBe(I18n.t('error_signup_rate_limited'))
})
