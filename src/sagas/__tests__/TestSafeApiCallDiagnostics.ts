import { runSaga } from 'redux-saga'
import crashlytics from '@react-native-firebase/crashlytics'
import Logger from 'helpers/Logger'
import { safeApiCall } from '../HelpersSaga'

describe('safeApiCall diagnostics', () => {
  const telemetry = crashlytics() as any
  const loggerError = jest.spyOn(Logger, 'error').mockImplementation(() => undefined)

  beforeEach(() => {
    jest.clearAllMocks()
    telemetry.recordError.mockReset()
    telemetry.setAttribute.mockReset()
    telemetry.recordError.mockResolvedValue(undefined)
    telemetry.setAttribute.mockResolvedValue(undefined)
  })

  test('returns undefined on failure while logging original locally and sanitized error remotely', async () => {
    const original = new Error('token=raw-token {"password":"raw-password"} deviceUUID=raw-device')
    const result: any[] = []
    await runSaga({ dispatch: jest.fn() }, function* () {
      result.push(yield* safeApiCall(() => { throw original }))
    }).toPromise()

    expect(result[0]).toBeUndefined()
    expect(loggerError).toHaveBeenCalledWith('Saga API call failed', original)
    const remote: Error = telemetry.recordError.mock.calls[0][0]
    expect(remote).toBeInstanceOf(Error)
    expect(remote.message).toContain('[REDACTED]')
    expect(remote.message).not.toContain('raw-token')
    expect(remote.message).not.toContain('raw-password')
    expect(remote.message).not.toContain('raw-device')
    expect(remote.message).toContain('Error')
  })

  test('returns successful result and telemetry failures remain nonfatal', async () => {
    const expected = { ok: true }
    const success: any[] = []
    await runSaga({ dispatch: jest.fn() }, function* () {
      success.push(yield* safeApiCall(() => expected))
    }).toPromise()
    expect(success[0]).toBe(expected)

    telemetry.recordError.mockImplementationOnce(() => { throw new Error('sync telemetry failure') })
    telemetry.setAttribute.mockRejectedValueOnce(new Error('telemetry unavailable'))
    const failed: any[] = []
    await runSaga({ dispatch: jest.fn() }, function* () {
      failed.push(yield* safeApiCall(() => { throw Object.assign(new Error('request failed'), { status: 503, context: 'race query' }) }))
    }).toPromise()
    expect(failed[0]).toBeUndefined()
    // setAttribute rejection may stop the telemetry sequence, but cannot escape or mask API failure.
  })

  afterAll(() => loggerError.mockRestore())
})
