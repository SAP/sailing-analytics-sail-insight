const METERS_PER_SECOND_TO_KNOTS_APPROX = 1.943844
const EARTH_RADIUS_IN_M = 6371000

export const metersPerSecondsToKnots = (mPerS: number) => mPerS >= 0 ? mPerS * METERS_PER_SECOND_TO_KNOTS_APPROX : -1

export const distanceInM = (latA: number, longA: number, latB: number, longB: number) => {
  const p = Math.PI / 180
  const c = Math.cos
  const a =
    0.5 - c((latB - latA) * p) / 2 +
    c(latA * p) * c(latB * p) *
    (1 - c((longB - longA) * p)) / 2

  return (2 * EARTH_RADIUS_IN_M) * Math.asin(Math.sqrt(a))
}
