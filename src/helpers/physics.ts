const METERS_PER_SECOND_TO_KNOTS_APPROX = 1.943844

export const metersPerSecondsToKnots = (mPerS: number) => mPerS >= 0 ? mPerS * METERS_PER_SECOND_TO_KNOTS_APPROX : -1
