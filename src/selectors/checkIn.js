import { createSelector } from 'reselect'
import { values } from 'lodash'

import { CHECK_IN_REDUCER_NAME } from 'reducers'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getBoatEntity } from './boat'
import { getCompetitorEntity } from './competitor'
import { getMarkEntity } from './mark'


export const getActiveCheckIns = state => state?.[CHECK_IN_REDUCER_NAME]?.active

export const getCheckInList = createSelector(
  getActiveCheckIns,
  getEventEntity,
  getLeaderboardEntity,
  getBoatEntity,
  getCompetitorEntity,
  getMarkEntity,
  (
    activeCheckIns,
    eventEntity,
    leaderboardEntity,
    boatEntity,
    competitorEntity,
    markEntity,
  ) => {
    if (!activeCheckIns) {
      return []
    }
    console.log(activeCheckIns, eventEntity, leaderboardEntity, boatEntity, competitorEntity, markEntity)
    return values(activeCheckIns).map(checkIn => checkIn && {
      ...checkIn,
      leaderboard: leaderboardEntity?.[checkIn.leaderboardName],
      event: eventEntity?.[checkIn.eventId],
      ...(checkIn.boatId && { boatId: boatEntity?.[checkIn.boatId] }),
      ...(checkIn.competitorId && { competitorId: competitorEntity?.[checkIn.competitorId] }),
      ...(checkIn.markId && { markId: markEntity?.[checkIn.markId] }),
    })
  },
)
