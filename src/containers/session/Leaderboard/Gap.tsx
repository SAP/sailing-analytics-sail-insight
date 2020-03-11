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
  fontSizeMultiplier?: number
}

const Gap = ({ gap, gain, fontSize, fontColor, rankingMetric, fontSizeMultiplier = 1 }: Props) => {
  let gapText
  let adjustedFontSize = fontSize

  if (gap === undefined) {
    gapText = EMPTY_VALUE
  } else if (rankingMetric !== 'ONE_DESIGN') {
    adjustedFontSize = fontSize * fontSizeMultiplier

    const negative = gap < 0
    const negativeText = negative ? '-' : ''

    const cappedGap = Math.min(Math.abs(gap), 100 * 24 * 60 * 60 - 1) // The cap is 100 days

    let formattedTime = moment.duration(cappedGap, 'seconds').format('DD:HH:mm:ss')
    if (cappedGap < 60) {
      formattedTime = `00:${formattedTime}`
    }
    gapText = `${negativeText}${formattedTime}`
  } else {
    gapText = `${Math.ceil(gap)}m`
  }

  const fontColorOverride = fontColor === undefined ? {} : { color: fontColor }

  const triangleFontSize = Math.floor(fontSize * 0.4)

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize: adjustedFontSize }
  const triangleFontSizeOverride = fontSize === undefined ? {} : { fontSize: triangleFontSize }
  const emptySpaceOverride = fontSize === undefined ? {} : { width: triangleFontSize }

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
