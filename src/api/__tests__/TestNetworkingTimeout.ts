/**
 * Desired behavior of api/networking.request on timeout:
 * the underlying fetch is aborted (an AbortSignal is passed to fetch and is
 * aborted when the timeout fires), not just abandoned.
 */
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import { request } from 'api/networking'

declare var beforeEach: any
declare var afterEach: any
declare var test: any
declare var expect: any

const originalFetch = (global as any).fetch

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  (global as any).fetch = originalFetch
  jest.useRealTimers()
})

// User impact: on a bad connection timed-out requests keep running in the
// background (battery/data, and late responses racing newer ones).
test('a timed-out request aborts the underlying fetch', async () => {
  const fetchMock = jest.fn(() => new Promise(() => undefined)) // never settles
  ;(global as any).fetch = fetchMock

  const result = request('https://example.com/api', { signer: null as any, timeout: 1000 })
  const assertion = expect(result).rejects.toHaveProperty('name', NetworkTimeoutException.NAME)
  // let getHeaders() resolve so fetch gets called
  for (let i = 0; i < 10; i++) { await Promise.resolve() }
  jest.advanceTimersByTime(1000)
  await assertion

  expect(fetchMock).toHaveBeenCalledTimes(1)
  const options: any = (fetchMock.mock.calls[0] as any[])[1]
  expect(options.signal).toBeDefined()
  expect(options.signal.aborted).toBe(true)
})
