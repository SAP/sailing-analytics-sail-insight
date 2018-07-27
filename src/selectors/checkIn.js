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
    return values(activeCheckIns).map(checkIn => checkIn && {
      ...checkIn,
      leaderboard: leaderboardEntity?.[checkIn.leaderboardName],
      event: eventEntity?.[checkIn.eventId],
      ...(checkIn.boatId && { boat: boatEntity?.[checkIn.boatId] }),
      ...(checkIn.competitorId && { competitor: competitorEntity?.[checkIn.competitorId] }),
      ...(checkIn.markId && { mark: markEntity?.[checkIn.markId] }),
    })
  },
)
