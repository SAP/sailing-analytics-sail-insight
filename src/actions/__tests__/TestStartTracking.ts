import { Alert } from 'react-native'

import { startTracking } from 'actions/tracking'

jest.mock('services/LocationService', () => ({ LocationTrackingStatus: { RUNNING: 'RUNNING' } }))
jest.mock('react-native-background-geolocation', () => ({ __esModule: true, default: {} }))

jest.mock('selectors/checkIn', () => ({
  ...jest.requireActual('selectors/checkIn'),
  getCheckInByLeaderboardName: () => () => undefined,
}))

describe('startTracking without a check-in for the leaderboard', () => {
  test('shows an error alert instead of throwing', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    const dispatch = jest.fn()

    await expect(startTracking({ data: 'Unknown Leaderboard', navigation: {} })(dispatch, () => ({}))).resolves.toBeUndefined()

    expect(alert).toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe('confirmSwitchTracking', () => {
  beforeEach(() => jest.restoreAllMocks())
  const { confirmSwitchTracking } = jest.requireActual('actions/tracking')
  const state = (status: string, lb?: string) => ({ locationTracking: { status, leaderboardName: lb } })

  test('no prompt when nothing else is tracked or the same event is tracked', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    await expect(confirmSwitchTracking(state('STOPPED', 'A'), 'B')).resolves.toBe(true)
    await expect(confirmSwitchTracking(state('RUNNING', 'A'), 'A')).resolves.toBe(true)
    expect(alert).not.toHaveBeenCalled()
  })

  test('asks before replacing a running track; cancel keeps it, yes continues', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    const cancelled = confirmSwitchTracking(state('RUNNING', 'A'), 'B')
    ;(alert.mock.calls[0][2] as any)[0].onPress()
    await expect(cancelled).resolves.toBe(false)
    const confirmed = confirmSwitchTracking(state('RUNNING', 'A'), 'B')
    ;(alert.mock.calls[1][2] as any)[1].onPress()
    await expect(confirmed).resolves.toBe(true)
  })
})
