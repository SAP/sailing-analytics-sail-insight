/**
 * Boat/competitor forms: whitespace-only values must count as empty, and
 * handicap values must be positive finite numbers.
 */
import { teamFromFormValues } from '../team'
import { validateHandicap, validateRequired } from '../validators'

declare var describe: any
declare var test: any
declare var expect: any

describe('validateRequired', () => {
  test('rejects empty and whitespace-only strings', () => {
    expect(validateRequired('')).toBeTruthy()
    expect(validateRequired(undefined)).toBeTruthy()
    expect(validateRequired('   ')).toBeTruthy()
    expect(validateRequired(' \t\n')).toBeTruthy()
  })

  test('accepts text with surrounding whitespace', () => {
    expect(validateRequired(' GER 1 ')).toBeUndefined()
  })
})

describe('validateHandicap', () => {
  const withValue = (handicapValue: any) => ({ handicapType: 'YARDSTICK', handicapValue } as any)

  test('rejects NaN, zero, negative and infinite values', () => {
    expect(validateHandicap(withValue('.'))).toBeTruthy()
    expect(validateHandicap(withValue('abc'))).toBeTruthy()
    expect(validateHandicap(withValue('0'))).toBeTruthy()
    expect(validateHandicap(withValue('-3'))).toBeTruthy()
    expect(validateHandicap(withValue(Infinity))).toBeTruthy()
  })

  test('accepts missing values and positive numbers with comma or dot', () => {
    expect(validateHandicap(withValue(undefined))).toBeUndefined()
    expect(validateHandicap(withValue(''))).toBeUndefined()
    expect(validateHandicap(withValue('1,5'))).toBeUndefined()
    expect(validateHandicap(withValue('95'))).toBeUndefined()
  })
})

describe('teamFromFormValues', () => {
  test('trims name, boat name and sail number', () => {
    const team: any = teamFromFormValues({ name: '  Ace ', boatName: ' B ', sailNumber: ' ger 12 ' })
    expect(team.name).toBe('Ace')
    expect(team.boatName).toBe('B')
    expect(team.sailNumber).toBe('GER 12')
  })
})
