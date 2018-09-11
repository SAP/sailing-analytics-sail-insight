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

export const degToCompass = (num: number) => {
  const val = Math.floor((num / 22.5) + 0.5)
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return arr[(val % 16)]
}

export const speedToWindClassification = (speedInKnots: number) => {
  if (speedInKnots < 1) { return 'Calm' }
  if (speedInKnots >= 1 && speedInKnots <= 3) { return 'Light air' }
  if (speedInKnots > 3 && speedInKnots <= 6) { return 'Light breeze' }
  if (speedInKnots > 6 && speedInKnots <= 10) { return 'Gentle breeze' }
  if (speedInKnots > 10 && speedInKnots <= 16) { return 'Moderate breeze' }
  if (speedInKnots > 16 && speedInKnots <= 21) { return 'Fresh breeze' }
  if (speedInKnots > 21 && speedInKnots <= 27) { return 'Strong breeze' }
  if (speedInKnots > 27 && speedInKnots <= 33) { return 'Near gale' }
  if (speedInKnots > 33 && speedInKnots <= 40) { return 'Gale' }
  if (speedInKnots > 40 && speedInKnots <= 47) { return 'Storm' }
  if (speedInKnots > 47 && speedInKnots <= 55) { return 'Violent storm' }
  if (speedInKnots > 55 && speedInKnots <= 63) { return 'Strong gale' }
  if (speedInKnots > 63) { return 'Hurricane' }
  return 'undefined'
}
