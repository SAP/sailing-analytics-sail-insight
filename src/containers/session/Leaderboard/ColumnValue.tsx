import React from 'react'
import { Text, View } from 'react-native'

import { always, cond, gt, isNil, lt, T } from 'ramda'

import { LeaderboardCompetitorCurrentTrack } from 'models'

import Gap from './Gap'
import { ColumnValueType, EMPTY_VALUE } from './Leaderboard'
import styles from './styles'

export interface Props {
  selectedColumn?: ColumnValueType
  competitorData: LeaderboardCompetitorCurrentTrack
  myCompetitorData?: LeaderboardCompetitorCurrentTrack
  fontSize?: number
  rankingMetric?: string
  halveGapIfOverOneHour?: boolean
}

const getGapValueByRankingMetric = (
  competitorData: LeaderboardCompetitorCurrentTrack,
  rankingMetric?: string
) =>
  competitorData.trackedColumnData &&
  (rankingMetric === 'ONE_DESIGN'
    ? competitorData.trackedColumnData.gapToLeaderInM
    : competitorData.trackedColumnData.gapToLeaderInS)

const RED = '#D42F33'
const GREEN = '#0B7A07'

const ColumnValue = ({
  selectedColumn,
  competitorData,
  myCompetitorData,
  fontSize,
  rankingMetric = 'ONE_DESIGN',
  halveGapIfOverOneHour = false,
}: Props) => {
  if (
    selectedColumn === ColumnValueType.GapToLeader ||
    selectedColumn === ColumnValueType.GapToCompetitor ||
    selectedColumn === ColumnValueType.GapToMyBoat
  ) {
    const { gain } = competitorData
    const gapToLeader = getGapValueByRankingMetric(competitorData, rankingMetric)
    const myGapToLeader = myCompetitorData && getGapValueByRankingMetric(myCompetitorData, rankingMetric)
    const fontColor = cond([
      [always(isNil(myGapToLeader)), always(undefined)],
      [isNil, always(undefined)],
      [lt(myGapToLeader), always(GREEN)],
      [gt(myGapToLeader), always(RED)],
      [T, always(undefined)]
    ])(gapToLeader)

    const gap = selectedColumn === ColumnValueType.GapToMyBoat && !isNil(myGapToLeader) && !isNil(gapToLeader)
      ? gapToLeader - myGapToLeader
      : gapToLeader

    return (
      <Gap
        gap={gap}
        gain={gain}
        fontSize={fontSize}
        fontColor={fontColor}
        rankingMetric={rankingMetric}
        halveGapIfOverOneHour={halveGapIfOverOneHour}
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
