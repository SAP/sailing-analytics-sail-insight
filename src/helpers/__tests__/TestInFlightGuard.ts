import { withInFlightGuard } from '../inFlightGuard'

describe('withInFlightGuard', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('ignores a second press while the first is pending, per screen', async () => {
    let release: () => void = () => undefined
    const fn = jest.fn(() => new Promise<void>(resolve => { release = resolve }))
    const guarded = withInFlightGuard(fn)
    const screenA = { navigation: {} }
    const screenB = { navigation: {} }

    guarded(screenA)
    guarded(screenA)
    guarded(screenB)
    expect(fn).toHaveBeenCalledTimes(2)
    release()
  })

  test('releases after a hang via the safety timeout', async () => {
    const fn = jest.fn(() => new Promise<void>(() => undefined))
    const guarded = withInFlightGuard(fn, 1000, 15000)
    const props = { navigation: {} }

    guarded(props)
    jest.advanceTimersByTime(14000)
    guarded(props)
    expect(fn).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1500)
    guarded(props)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('releases after cool-down once settled', async () => {
    const fn = jest.fn(async () => undefined)
    const guarded = withInFlightGuard(fn)
    const props = { navigation: {} }

    await guarded(props)
    await guarded(props)
    expect(fn).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1100)
    await guarded(props)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
