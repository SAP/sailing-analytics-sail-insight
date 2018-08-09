import { values } from 'lodash'
import { createSelector } from 'reselect'

import { CHECK_IN_REDUCER_NAME } from 'reducers'
import { getBoatEntity } from './boat'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getTrackedEventId } from './location'
import { getMarkEntity } from './mark'


export const getActiveCheckIns = (state: any) =>
  state && state[CHECK_IN_REDUCER_NAME] && state[CHECK_IN_REDUCER_NAME].active

export const getCheckInByLeaderboardName = (state: any, leaderboardName: string) =>
  state && state[CHECK_IN_REDUCER_NAME] && state[CHECK_IN_REDUCER_NAME][leaderboardName]

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
      leaderboard: leaderboardEntity && leaderboardEntity[checkIn.leaderboardName],
      event: eventEntity && eventEntity[checkIn.eventId],
      ...(checkIn.boatId && { boat: boatEntity && boatEntity[checkIn.boatId] }),
      ...(checkIn.competitorId && { competitor: competitorEntity && competitorEntity[checkIn.competitorId] }),
      ...(checkIn.markId && { mark: markEntity && markEntity[checkIn.markId] }),
    })
  },
)

export const getTrackedEvent = createSelector(
  getTrackedEventId,
  getEventEntity,
  (eventId, eventEntity) => eventEntity && eventEntity[eventId],
)

export const getTrackedEventBaseUrl = createSelector(
  getTrackedEvent,
  (event: any) => event && event.baseUrl,
)
