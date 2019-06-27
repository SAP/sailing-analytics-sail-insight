import React from 'react'
import { Text, View } from 'react-native'

import { LeaderboardCompetitorCurrentTrack } from 'models'

import Gap from './Gap'
import { ColumnValueType, EMPTY_VALUE } from './Leaderboard'
import styles from './styles'

export interface Props {
  selectedColumn?: ColumnValueType
  competitorData: LeaderboardCompetitorCurrentTrack
  fontSize?: number
  rankingMetric?: string
}

const ColumnValue = ({
  selectedColumn,
  competitorData,
  fontSize,
  rankingMetric = 'ONE_DESIGN',
}: Props) => {
  if (
    selectedColumn === ColumnValueType.GapToLeader ||
    selectedColumn === ColumnValueType.GapToCompetitor
  ) {
    const { gain } = competitorData
    const gapToLeader =
      competitorData.trackedColumnData &&
      (rankingMetric === 'ONE_DESIGN'
        ? competitorData.trackedColumnData.gapToLeaderInM
        : competitorData.trackedColumnData.gapToLeaderInS)

    return (
      <Gap
        gap={gapToLeader}
        gain={gain}
        fontSize={fontSize}
        rankingMetric={rankingMetric}
      />
    )
  }

  let value

  switch (selectedColumn) {
    case ColumnValueType.RegattaRank:
      value = competitorData.overallRank
      break
    case ColumnValueType.Speed:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.currentSpeedOverGround
      break
    case ColumnValueType.AverageSpeed:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.averageSpeedOverGround
      break
    case ColumnValueType.DistanceTravelled:
      const distanceTravelled =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.distanceTravelled
      value =
        distanceTravelled !== undefined
          ? Math.floor(distanceTravelled)
          : undefined
      break
    case ColumnValueType.NumberOfManeuvers:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.numberOfManeuvers
      break
    default:
      value = undefined
      break
  }

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText, fontSizeOverride]}>
        {value || EMPTY_VALUE}
      </Text>
    </View>
  )
}

export default ColumnValue
