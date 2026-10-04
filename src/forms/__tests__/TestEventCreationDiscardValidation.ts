/**
 * Create Event form: discard thresholds must be validated.
 *
 * User-facing problem: the discard validation in `validate` (src/forms/eventCreation.ts)
 * is commented out, so a user can enter discard thresholds like [5, 3] or [3, 3].
 * The server then gets nonsense `leaderboardDiscardThresholds` and either rejects
 * the event with an opaque error or scores the regatta wrongly.
 *
 * Contract for the fix:
 * - `validate(values)` returns a truthy error (any string) under the `discards`
 *   key (FORM_KEY_DISCARDS) when the thresholds are not strictly ascending
 *   (descending or duplicate values).
 * - Strictly ascending thresholds and an empty list produce no `discards` error.
 */
import moment from 'moment'

import { RegattaType } from 'models/EventCreationData'
import { FORM_KEY_DISCARDS, validate } from '../eventCreation'

declare var describe: any
declare var test: any
declare var expect: any

const validValues = (discards: number[]) => ({
  name: 'My regatta',
  location: 'Kiel',
  regattaType: RegattaType.OneDesign,
  boatClass: '49er',
  dateFrom: moment().startOf('day'),
  dateTo: moment().endOf('day'),
  numberOfRaces: 10,
  [FORM_KEY_DISCARDS]: discards,
})

describe('event creation form: discard thresholds', () => {
  test('rejects descending discard thresholds', () => {
    const errors = validate(validValues([5, 3]), {})
    expect(errors[FORM_KEY_DISCARDS]).toBeTruthy()
  })

  test('rejects duplicate discard thresholds', () => {
    const errors = validate(validValues([3, 3]), {})
    expect(errors[FORM_KEY_DISCARDS]).toBeTruthy()
  })

  test('accepts strictly ascending discard thresholds', () => {
    const errors = validate(validValues([3, 6, 9]), {})
    expect(errors[FORM_KEY_DISCARDS]).toBeFalsy()
  })

  test('accepts no discards at all', () => {
    const errors = validate(validValues([]), {})
    expect(errors[FORM_KEY_DISCARDS]).toBeFalsy()
  })
})
