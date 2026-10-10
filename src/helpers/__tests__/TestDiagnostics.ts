jest.mock('react-native-background-geolocation', () => ({
  __esModule: true,
  default: { logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } },
}))
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/documents',
  mkdir: jest.fn(), readDir: jest.fn(), appendFile: jest.fn(), unlink: jest.fn(),
}))

import RNFS from 'react-native-fs'
import Logger from '../Logger'
import { serializeDiagnostic } from '../diagnosticsRedaction'

// These inspect the real production serialization/storage boundary, which
// UI journeys cannot force to receive credential-bearing nested errors.
test('keeps operational context while removing actual credential and identity fields', () => {
  const text = serializeDiagnostic({
    status: 403, method: 'POST', eventId: 42, raceId: 9,
    accessToken: 'TOKEN-SECRET', password: 'PASSWORD-SECRET',
    username: 'USER-SECRET', email: 'sailor@example.test', deviceUUID: 'DEVICE-SECRET',
    url: 'https://alice:pass@example.test/create_user?password=URL-SECRET&username=USER-SECRET&eventId=42',
  })
  expect(text).not.toMatch(/TOKEN-SECRET|PASSWORD-SECRET|USER-SECRET|DEVICE-SECRET|URL-SECRET|sailor@example|alice:pass/)
  expect(text).toContain('"status":403')
  expect(text).toContain('"raceId":9')
  expect(text).toContain('eventId=42')
})

test('preserves backend error codes in JSON messages without their credentials', () => {
  const error = new Error(JSON.stringify({ errorCodeName: 'EVENT_ALREADY_EXISTS', access_token: 'BACKEND-SECRET' }))
  const text = serializeDiagnostic(error)
  expect(text).toContain('EVENT_ALREADY_EXISTS')
  expect(text).not.toContain('BACKEND-SECRET')
})

test('Logger persists credential-free app output with operational context', async () => {
  const fs = RNFS as any
  fs.mkdir.mockResolvedValue(undefined)
  fs.readDir.mockResolvedValue([])
  fs.appendFile.mockResolvedValue(undefined)
  Logger.log('Request failed', { password: 'PERSISTED-SECRET', eventId: 42 })
  const { readPersistentLogs } = require('../PersistentLog')
  await readPersistentLogs()
  const written = fs.appendFile.mock.calls.map((call: any[]) => call[1]).join('')
  expect(written).toContain('Request failed')
  expect(written).toContain('"eventId":42')
  expect(written).not.toContain('PERSISTED-SECRET')
})
