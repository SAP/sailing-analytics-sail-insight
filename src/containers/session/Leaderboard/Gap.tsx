import React from 'react'
import { Text, View } from 'react-native'

import moment from 'moment'

import { EMPTY_VALUE } from './Leaderboard'
import styles from './styles'

const TRIANGLE_UP = '▲'
const TRIANGLE_DOWN = '▼'

interface Props {
  rankingMetric: string
  gap?: number
  gain?: boolean
  fontColor?: string
  fontSize?: number
  fontMultiplierIfOverOneHour?: number
}

const Gap = ({ gap, gain, fontSize, fontColor, rankingMetric, fontMultiplierIfOverOneHour = 1 }: Props) => {
  let gapText
  let adjustedFontSize = fontSize
  let adjustedTriangleFontSize = fontSize - 10

  if (gap === undefined) {
    gapText = EMPTY_VALUE
  } else if (rankingMetric !== 'ONE_DESIGN') {
    const negative = gap < 0
    const negativeText = negative ? '-' : ''

    const cappedGap = Math.min(Math.abs(gap), 100 * 24 * 60 * 60 - 1) // The cap is 100 days

    const formattedTime = moment.duration(cappedGap, 'seconds').format('DD:HH:mm:ss')
    gapText = `${negativeText}${formattedTime}`
    if (cappedGap >= 3600) {
      adjustedFontSize = Math.floor(fontSize * fontMultiplierIfOverOneHour)
      adjustedTriangleFontSize = Math.floor(adjustedTriangleFontSize * fontMultiplierIfOverOneHour)
    }
  } else {
    gapText = `${Math.ceil(gap)}m`
  }

  const fontColorOverride = fontColor === undefined ? {} : { color: fontColor }

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize: adjustedFontSize }
  const triangleFontSizeOverride = fontSize === undefined ? {} : { fontSize: adjustedTriangleFontSize }
  const emptySpaceOverride = fontSize === undefined ? {} : { width: fontSize }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText, fontSizeOverride, fontColorOverride]}>{gapText}</Text>
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
