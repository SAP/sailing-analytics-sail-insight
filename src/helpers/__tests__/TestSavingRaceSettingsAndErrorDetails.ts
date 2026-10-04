jest.mock('services/LocationService', () => ({}))

import reducer from 'reducers/EventReducer'
import { updateSavingRaceSettings, resetSavingRaceSettings } from 'actions/events'
import { isSavingRaceSettings } from 'selectors/event'
import { getErrorDetails } from 'helpers/texts'

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

describe('getErrorDetails redaction', () => {
  test('redacts user query params and secrets in the body', () => {
    const details = getErrorDetails({
      name: 'ApiException',
      url: 'https://x.test/a?email=me@x.com&username=bob&id=7',
      data: '{"access_token":"abc","password":"p\\"w","id":"7"}',
    }) as string
    expect(details).toContain('email=***')
    expect(details).toContain('username=***')
    expect(details).toContain('id=7')
    expect(details).not.toContain('abc')
    expect(details).not.toContain('p\\"w')
    expect(details).toContain('"id":"7"')
  })
})
