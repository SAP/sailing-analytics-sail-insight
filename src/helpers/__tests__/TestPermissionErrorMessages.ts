/**
 * Permission-denied responses must produce a permission message, not "Oops (400)".
 *
 * User-facing problem: creating an event on a server where the user lacks rights
 * returned HTTP 400 with the body
 *   org.apache.shiro.authz.UnauthorizedException: Subject does not have permission [SERVER:CREATE_OBJECT:sail-insight-e2e]
 * and the app showed "Oops, something went wrong here. Please try again! (400)",
 * which invites pointless retries.
 *
 * Contract for the fix:
 * - New i18n key `error_permission_denied` in src/i18n/translations/en.json,
 *   e.g. "You don't have permission to do this on this server."
 * - `getErrorDisplayMessage` (src/helpers/texts.ts) returns
 *   I18n.t('error_permission_denied') for an ApiException whose message/body
 *   contains `UnauthorizedException` or `does not have permission`
 *   (case-insensitive is fine), regardless of HTTP status.
 * - Other mappings stay as they are (see TestErrorMessages.ts).
 */
import ApiException from 'api/ApiException'

import I18n from 'i18n'
import { MISSING_PREFIX } from 'i18n/utils'
import { getErrorDisplayMessage } from '../texts'

declare var beforeAll: any
declare var test: any
declare var expect: any

const SHIRO_BODY =
  'org.apache.shiro.authz.UnauthorizedException: Subject does not have permission [SERVER:CREATE_OBJECT:sail-insight-e2e]'

beforeAll(() => {
  I18n.locale = 'en'
})

test('a 400 with a Shiro UnauthorizedException body shows the permission message, not "Oops (400)"', () => {
  // handler.ts creates ApiException(message = body text, status, data = body text)
  const message = getErrorDisplayMessage(ApiException.create(SHIRO_BODY, 400, SHIRO_BODY))
  expect(message).toBe(I18n.t('error_permission_denied'))
  expect(message).not.toContain('400')
})

test('permission-denied bodies are recognised for any status (403, 500)', () => {
  for (const status of [403, 500]) {
    expect(getErrorDisplayMessage(ApiException.create(SHIRO_BODY, status, SHIRO_BODY)))
      .toBe(I18n.t('error_permission_denied'))
  }
})

test('"does not have permission" alone is enough to recognise a permission error', () => {
  const body = 'Subject does not have permission [EVENT:UPDATE:1234]'
  expect(getErrorDisplayMessage(ApiException.create(body, 400, body)))
    .toBe(I18n.t('error_permission_denied'))
})

test('an unrelated 400 still uses the generic message with the code', () => {
  const message = getErrorDisplayMessage(ApiException.create('some other problem', 400, 'some other problem'))
  expect(message).not.toBe(I18n.t('error_permission_denied'))
})
