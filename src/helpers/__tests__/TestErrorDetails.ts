/**
 * NEW FEATURE "technical error details for pro users".
 *
 * Contract: helpers/texts exports `getErrorDetails(exception): string | undefined`
 *   - undefined for falsy input
 *   - multi-line text containing: exception name, message, HTTP status (if any),
 *     `<METHOD> <URL>` (ApiException.url / ApiException.method),
 *     response body (ApiException.data; objects JSON-stringified) truncated to 2000 chars
 *   - query-string values of secret/token/password-like params (name contains
 *     "secret", "token" or "password", case-insensitive) are redacted; param names stay.
 */
import ApiException from 'api/ApiException'
import * as texts from 'helpers/texts'

declare var test: any
declare var expect: any

const getErrorDetails = (e: any) => {
  const fn = (texts as any).getErrorDetails
  expect(typeof fn).toBe('function')
  return fn(e)
}

const apiException = (data: any = 'server said no') => {
  const e: any = ApiException.create('Internal error', 500, data)
  e.url = 'https://sapsailing.com/sailingserver/api/v1/leaderboards/lb?competitorId=c-42&secret=abc123SECRET&access_token=tok999&Password=pw777'
  e.method = 'POST'
  return e
}

// A screenshot of these details may be shared with support - it must not leak credentials.
test('redacts secret/token/password query parameter values but keeps their names', () => {
  const details = getErrorDetails(apiException())
  expect(details).not.toContain('abc123SECRET')
  expect(details).not.toContain('tok999')
  expect(details).not.toContain('pw777')
  expect(details).toContain('secret=')
  expect(details).toContain('access_token=')
})

test('truncates the response body to 2000 characters', () => {
  const details = getErrorDetails(apiException('x'.repeat(5000)))
  expect(details).toContain('x'.repeat(2000))
  expect(details).not.toContain('x'.repeat(2001))
})

