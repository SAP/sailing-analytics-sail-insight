// Ignores calls while the previous one for the same key is still running (plus a
// short cool-down for the navigation transition). The key comes from the first
// argument via `getKey` (e.g. the screen's navigation object), so one screen
// cannot block another. A safety timeout releases the guard if `fn` hangs
// (permission prompt, request without timeout), so buttons never stay dead.
export const withInFlightGuard = <T extends (...args: any[]) => any>(
  fn: T,
  coolDownMs = 1000,
  maxBusyMs = 15000,
  getKey: (...args: Parameters<T>) => object | undefined = (props: any) => props && props.navigation
) => {
  const globalKey = {}
  const busyUntilRelease = new WeakMap<object, number>()
  let counter = 0
  return async (...args: Parameters<T>) => {
    const key = getKey(...args) || globalKey
    if (busyUntilRelease.has(key)) {
      return
    }
    const token = ++counter
    busyUntilRelease.set(key, token)
    const release = () => {
      if (busyUntilRelease.get(key) === token) busyUntilRelease.delete(key)
    }
    const safety = setTimeout(release, maxBusyMs)
    try {
      return await fn(...args)
    } finally {
      clearTimeout(safety)
      setTimeout(release, coolDownMs)
    }
  }
}
