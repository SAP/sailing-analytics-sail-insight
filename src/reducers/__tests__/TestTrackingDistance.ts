// the reducer imports actions/auth, which pulls in the native geolocation plugin
jest.mock('react-native-background-geolocation', () => ({}))
jest.mock('actions/auth', () => ({ removeUserData: 'REMOVE_USER_DATA' }))

import reducer from '../LocationTrackingReducer'
import { updateTrackingStatistics } from 'actions/locationTrackingData'

const fix = (odometer: number, timeMillis: number) =>
  updateTrackingStatistics({ latitude: 1, longitude: 1, odometer, timeMillis } as any)

const run = (fixes: Array<[number, number]>) =>
  fixes.reduce((state: any, [odometer, t]) => reducer(state, fix(odometer, t) as any), undefined as any)

describe('tracking distance', () => {
  test('counts normal sailing segments', () => {
    // 10 m/s (~19 knots)
    const state = run([[0, 0], [10, 1000], [20, 2000]])
    expect(state.distance).toBe(20)
  })

  test('ignores a GPS teleport but keeps counting afterwards', () => {
    // 8,719 km within one second after a stale fix, then 5 m of real movement
    const state = run([[0, 0], [8719000, 1000], [8719005, 2000]])
    expect(state.distance).toBe(5)
  })

  test('resets the offset when the odometer is reset', () => {
    const state = run([[0, 0], [5000, 1000], [0, 2000], [8, 3000]])
    expect(state.distance).toBe(8)
  })
})
