jest.mock('services/LocationService', () => ({}))
jest.mock('@react-native-clipboard/clipboard', () => ({ __esModule: true, default: {} }))

import reducer from 'reducers/EventReducer'
import { updateSavingRaceSettings, resetSavingRaceSettings } from 'actions/events'
import { isSavingRaceSettings } from 'selectors/event'

const saving = (state: any) => isSavingRaceSettings({ events: state })

describe('isSavingRaceSettings with overlapping saves', () => {
  test('stays set until every save finished', () => {
    let state: any = reducer(undefined, { type: '@@init' } as any)
    state = reducer(state, updateSavingRaceSettings(true) as any)
    state = reducer(state, updateSavingRaceSettings(true) as any)
    state = reducer(state, updateSavingRaceSettings(false) as any)
    expect(saving(state)).toBe(true)
    state = reducer(state, updateSavingRaceSettings(false) as any)
    expect(saving(state)).toBe(false)
  })

  test('reset clears a stale count', () => {
    let state: any = reducer(undefined, updateSavingRaceSettings(true) as any)
    state = reducer(state, resetSavingRaceSettings() as any)
    expect(saving(state)).toBe(false)
  })
})
