/**
 * NEW FEATURE "technical error details": an ApiException thrown by api/handler
 * for a non-2xx response carries the request `url` and `method`
 * (fields `ApiException.url?: string`, `ApiException.method?: string`).
 */
import ApiException from 'api/ApiException'
import { dataRequest } from 'api/handler'

declare var afterEach: any
declare var test: any
declare var expect: any

const originalFetch = (global as any).fetch
afterEach(() => { (global as any).fetch = originalFetch })

const fakeResponse = (status: number, body: string, url: string) => {
  const response: any = {
    ok: status >= 200 && status < 300,
    status,
    url,
    text: async () => body,
    json: async () => JSON.parse(body),
  }
  response.clone = () => response
  return response
}

test('a 500 response yields an ApiException with status, url and method', async () => {
  const url = 'https://example.com/sailingserver/api/v1/regattas/r1/competitors?secret=s'
  ;(global as any).fetch = jest.fn(async () => fakeResponse(500, 'boom', url))

  let error: any
  try {
    await dataRequest(url, { method: 'POST', signer: null as any })
  } catch (e) {
    error = e
  }

  expect(error).toBeDefined()
  expect(error.name).toBe(ApiException.NAME)
  expect(error.status).toBe(500)
  expect(error.url).toBe(url)
  expect(error.method).toBe('POST')
})

test('GET is recorded as the method when none was given', async () => {
  const url = 'https://example.com/sailingserver/api/v1/events'
  ;(global as any).fetch = jest.fn(async () => fakeResponse(404, 'not found', url))

  const error: any = await dataRequest(url, { signer: null as any }).catch((e: any) => e)

  expect(error.status).toBe(404)
  expect(error.url).toBe(url)
  expect(error.method).toBe('GET')
})
