import { Alert } from 'react-native'

import { startTracking } from 'actions/tracking'

jest.mock('services/LocationService', () => ({}))
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
