import React from 'react'
import { Text, View } from 'react-native'

import { EMPTY_VALUE } from './Leaderboard'
import styles from './styles'

const TRIANGLE_UP = '▲'
const TRIANGLE_DOWN = '▼'

interface Props {
  rankingMetric: string
  gap?: number
  gain?: boolean
  fontSize?: number
}

const Gap = ({ gap, gain, fontSize, rankingMetric }: Props) => {
  let gapText

  if (gap === undefined) {
    gapText = EMPTY_VALUE
  } else if (rankingMetric !== 'ONE_DESIGN') {
    const negative = gap < 0
    const negativeText = negative ? '-' : ''

    const gapRounded = Math.ceil(gap)
    const gapAbs = Math.abs(gapRounded)
    const minutes = Math.floor(gapAbs / 60)
    const seconds = gapAbs % 60
    gapText =
      minutes !== 0
        ? `${negativeText}${minutes}m ${seconds}s`
        : `${negativeText}${seconds}s`
  } else {
    gapText = `${Math.ceil(gap)}m`
  }

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize }
  const triangleFontSizeOverride = fontSize === undefined ? {} : { fontSize: fontSize - 10 }
  const emptySpaceOverride = fontSize === undefined ? {} : { width: fontSize }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText, fontSizeOverride]}>{gapText}</Text>
      {/* This is so that numbers wihtout the indicators are aligned
          with numbers which have indicators */}
      {gain === undefined && (
        <View style={[styles.triangleEmptySpace, emptySpaceOverride]} />
      )}
      <Text
        style={[
          styles.triangle,
          triangleFontSizeOverride,
          gain === true ? styles.green : styles.red,
        ]}
      >
        {gain === undefined ? '' : gain === true ? TRIANGLE_UP : TRIANGLE_DOWN}
      </Text>
    </View>
  )
}

export default Gap
