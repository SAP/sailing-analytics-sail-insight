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
  halveGapIfOverOneHour?: boolean
}

const Gap = ({ gap, gain, fontSize, fontColor, rankingMetric, halveGapIfOverOneHour = false }: Props) => {
  let gapText
  let adjustedFontSize = fontSize

  if (gap === undefined) {
    gapText = EMPTY_VALUE
  } else if (rankingMetric !== 'ONE_DESIGN') {
    const negative = gap < 0
    const negativeText = negative ? '-' : ''

    const formattedTime = moment.duration(Math.abs(gap), 'seconds').format('DD:HH:mm:ss')
    gapText = `${negativeText}${formattedTime}`
    if (halveGapIfOverOneHour && Math.abs(gap) >= 3600) {
      adjustedFontSize = Math.floor(fontSize / 2)
    }
  } else {
    gapText = `${Math.ceil(gap)}m`
  }

  const fontColorOverride = fontColor === undefined ? {} : { color: fontColor }
  const triangleFontSizeOverride = fontSize === undefined ? {} : { fontSize: fontSize - 10 }

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize: adjustedFontSize }
  const emptySpaceOverride = fontSize === undefined ? {} : { width: adjustedFontSize }

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
