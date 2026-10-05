/**
 * Bounds (min inclusive, max exclusive, as used by the overlay picker's
 * range) for a discard threshold, so the list of thresholds stays strictly
 * ascending and within the planned number of races.
 *
 * @param discards current thresholds, ascending
 * @param index index of the threshold being edited, or undefined when a new
 *   threshold is appended
 * @param maxExclusive upper bound (exclusive) given by the planned races
 */
export const getDiscardBounds = (discards: number[], index: number | undefined, maxExclusive: number) => {
  const isNew = index === undefined || index === null
  const previous = isNew ? discards[discards.length - 1] : discards[index as number - 1]
  const next = isNew ? undefined : discards[index as number + 1]
  const min = previous === undefined ? 1 : previous + 1
  const max = next === undefined ? maxExclusive : Math.min(next, maxExclusive)
  return { min, max, hasOptions: min < max }
}
