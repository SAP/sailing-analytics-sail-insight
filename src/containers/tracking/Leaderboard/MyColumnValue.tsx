import React from 'react'

import { LeaderboardCompetitorCurrentTrack } from 'models'

import { ColumnValueType } from 'containers/tracking/Leaderboard/Leaderboard'
import ColumnValue, { Props as ColumnValueProps } from './ColumnValue'

interface MyColumnValueProps extends ColumnValueProps {
  comparedCompetitorData?: LeaderboardCompetitorCurrentTrack
}

const MyColumnValue = ({
  selectedColumn,
  competitorData,
  fontSize,
  comparedCompetitorData,
  rankingMetric = 'ONE_DESIGN',
}: MyColumnValueProps) => {

  if (selectedColumn === ColumnValueType.GapToCompetitor) {
    const myGapToLeader =
      competitorData.trackedColumnData &&
      (rankingMetric === 'ONE_DESIGN'
        ? competitorData.trackedColumnData.gapToLeaderInM
        : competitorData.trackedColumnData.gapToLeaderInS)
    const comparedGapToLeader =
      comparedCompetitorData &&
      comparedCompetitorData.trackedColumnData &&
      (rankingMetric === 'ONE_DESIGN'
        ? comparedCompetitorData.trackedColumnData.gapToLeaderInM
        : comparedCompetitorData.trackedColumnData.gapToLeaderInS)

    const gapToCompetitor =
      comparedGapToLeader === undefined || myGapToLeader === undefined
        ? undefined
        : myGapToLeader - comparedGapToLeader

    const modifiedCompetitorData: LeaderboardCompetitorCurrentTrack = {
      ...competitorData,
      gain: undefined,
      trackedColumnData: {
        ...competitorData.trackedColumnData,
        [rankingMetric === 'ONE_DESIGN' ? 'gapToLeaderInM' : 'gapToLeaderInS']: gapToCompetitor,
      },
    }

    return (
      <ColumnValue
        selectedColumn={selectedColumn}
        competitorData={modifiedCompetitorData}
        fontSize={fontSize}
        rankingMetric={rankingMetric}
      />
    )
  }

  return (
    <ColumnValue
      selectedColumn={selectedColumn}
      competitorData={competitorData}
      fontSize={fontSize}
      rankingMetric={rankingMetric}
    />
  )
}

export default MyColumnValue
