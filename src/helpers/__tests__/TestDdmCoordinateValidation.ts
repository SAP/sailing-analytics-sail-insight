/**
 * Specification for validating manually entered coordinates in the course
 * editor's Geolocation screen (degrees + decimal minutes, "DDM").
 * Expected to fail until the validator exists.
 *
 * Contract assumed (new export from src/helpers/utils.ts):
 *   isValidDdmCoordinate(degrees: string | number, minutes: string | number,
 *                        unit: 'latitude' | 'longitude'): boolean
 *   - degrees/minutes may be strings as typed in the inputs; a ',' decimal
 *     separator is accepted (same as ddm2dd).
 *   - degrees: finite, integer-valued, 0 <= deg <= 90 (latitude) / 180 (longitude)
 *     (sign/hemisphere is selected separately via the N/S, E/W switch).
 *   - minutes: finite, 0 <= min < 60.
 *   - the resulting absolute value deg + min/60 must not exceed 90 / 180.
 *   - empty/non-numeric/NaN/Infinity -> false.
 * The Geolocation screen must use it to reject invalid input instead of
 * moving the mark (ddm2dd itself happily converts 999° 75').
 */
import * as utils from '../utils'

declare var describe: any
declare var test: any
declare var expect: any

const isValid = (...args: any[]) => (utils as any).isValidDdmCoordinate(...args)

describe('isValidDdmCoordinate', () => {
  // User impact: typing 999° or 75' moved the mark to an impossible position
  // that was then saved to the server.
  test('accepts valid latitude and longitude values', () => {
    expect(typeof (utils as any).isValidDdmCoordinate).toBe('function')
    expect(isValid('54', '19.123', 'latitude')).toBe(true)
    expect(isValid(0, 0, 'latitude')).toBe(true)
    expect(isValid('90', '0', 'latitude')).toBe(true)
    expect(isValid('10', '59,999', 'longitude')).toBe(true)
    expect(isValid('180', '0', 'longitude')).toBe(true)
  })

  test('rejects latitude degrees above 90 and longitude degrees above 180', () => {
    expect(typeof (utils as any).isValidDdmCoordinate).toBe('function')
    expect(isValid('91', '0', 'latitude')).toBe(false)
    expect(isValid('999', '0', 'latitude')).toBe(false)
    expect(isValid('181', '0', 'longitude')).toBe(false)
    expect(isValid('999', '0', 'longitude')).toBe(false)
  })

  test('rejects coordinates exceeding the limit through the minutes part', () => {
    expect(typeof (utils as any).isValidDdmCoordinate).toBe('function')
    expect(isValid('90', '0.5', 'latitude')).toBe(false)
    expect(isValid('180', '1', 'longitude')).toBe(false)
  })

  test('rejects minutes outside [0, 60)', () => {
    expect(typeof (utils as any).isValidDdmCoordinate).toBe('function')
    expect(isValid('54', '60', 'latitude')).toBe(false)
    expect(isValid('54', '75', 'latitude')).toBe(false)
    expect(isValid('54', '-1', 'latitude')).toBe(false)
  })

  test('rejects non-finite and non-numeric input', () => {
    expect(typeof (utils as any).isValidDdmCoordinate).toBe('function')
    expect(isValid('abc', '0', 'latitude')).toBe(false)
    expect(isValid('54', 'x', 'latitude')).toBe(false)
    expect(isValid(NaN, 0, 'longitude')).toBe(false)
    expect(isValid(Infinity, 0, 'longitude')).toBe(false)
    expect(isValid('', '', 'latitude')).toBe(false)
    expect(isValid('-5', '0', 'latitude')).toBe(false)
  })
})
