jest.mock('api/networking', () => ({ request: jest.fn() }))

import ApiDataException from 'api/ApiDataException'
import { dataRequest, listRequest } from 'api/handler'
import * as networking from 'api/networking'
import { mapResToAccessTokenData } from 'models/ApiAccessToken'
import { mapResToUser } from 'models/User'

declare var afterEach: any
declare var test: any
declare var expect: any

afterEach(() => { jest.clearAllMocks() })

const response = (body: string) => ({
  ok: true,
  status: 200,
  text: async () => body,
  clone() { return this },
})

const respondWith = (body: string) => {
  ;(networking.request as jest.Mock).mockResolvedValue(response(body))
}

test.each(['', 'null', '{}', '{"username":"sailor"}'])(
  'rejects a successful auth response without an access token (%s)', async body => {
    respondWith(body)
    await expect(dataRequest('https://example.test/access_token', {
      dataProcessor: mapResToAccessTokenData,
      signer: null as any,
    })).rejects.toHaveProperty('name', ApiDataException.NAME)
  },
)

test.each(['', 'null', '{}', '[]'])(
  'rejects a successful current-user response without a username (%s)', async body => {
    respondWith(body)
    await expect(dataRequest('https://example.test/user', {
      dataProcessor: mapResToUser,
      signer: null as any,
    })).rejects.toHaveProperty('name', ApiDataException.NAME)
  },
)

test('keeps a valid empty list but rejects null or non-list successful payloads', async () => {
  respondWith('[]')
  await expect(listRequest('https://example.test/items', { signer: null as any })).resolves.toEqual([])

  respondWith('null')
  await expect(listRequest('https://example.test/items', { signer: null as any }))
    .rejects.toHaveProperty('name', ApiDataException.NAME)

  respondWith('{"items":[]}')
  await expect(listRequest('https://example.test/items', { signer: null as any }))
    .rejects.toHaveProperty('name', ApiDataException.NAME)
})
