import React from 'react'

import { LeaderboardCompetitorCurrentTrack } from 'models'

import ColumnValue, { Props as ColumnValueProps } from './ColumnValue'
import { ColumnValueType } from './Leaderboard'

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

  let adjustedCompetitorData: LeaderboardCompetitorCurrentTrack = competitorData

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

    adjustedCompetitorData = {
      ...competitorData,
      gain: undefined,
      trackedColumnData: {
        ...competitorData.trackedColumnData,
        [rankingMetric === 'ONE_DESIGN' ? 'gapToLeaderInM' : 'gapToLeaderInS']: gapToCompetitor,
      },
    }
  }

  if (selectedColumn === ColumnValueType.GapToMyBoat) {
    adjustedCompetitorData = {
      ...competitorData,
      trackedColumnData: {
        ...competitorData.trackedColumnData,
        [rankingMetric === 'ONE_DESIGN' ? 'gapToLeaderInM' : 'gapToLeaderInS']: undefined,
      },
    }
  }

  return (
    <ColumnValue
      selectedColumn={selectedColumn}
      competitorData={adjustedCompetitorData}
      myCompetitorData={competitorData}
      fontSize={fontSize}
      rankingMetric={rankingMetric}
      fontMultiplierIfOverOneHour={0.5}
    />
  )
}

export default MyColumnValue
