import { getDiscardBounds } from 'helpers/discards'

describe('getDiscardBounds', () => {
  test('first threshold may use any race up to the planned races', () => {
    expect(getDiscardBounds([], undefined, 7)).toEqual({ min: 1, max: 7, hasOptions: true })
  })

  test('a new threshold must be greater than the last one', () => {
    expect(getDiscardBounds([2, 4], undefined, 7)).toEqual({ min: 5, max: 7, hasOptions: true })
  })

  test('no options are left when the last threshold is the last planned race', () => {
    expect(getDiscardBounds([2, 6], undefined, 7).hasOptions).toBe(false)
  })

  test('an existing threshold stays strictly between its neighbours', () => {
    expect(getDiscardBounds([2, 4, 8], 1, 20)).toEqual({ min: 3, max: 8, hasOptions: true })
  })

  test('first and last existing thresholds are bounded by 1 and the planned races', () => {
    expect(getDiscardBounds([3, 5], 0, 10)).toEqual({ min: 1, max: 5, hasOptions: true })
    expect(getDiscardBounds([3, 5], 1, 10)).toEqual({ min: 4, max: 10, hasOptions: true })
  })

  test('the planned races cap the range of a middle threshold too', () => {
    expect(getDiscardBounds([2, 9], 0, 5).max).toBe(5)
  })
})
