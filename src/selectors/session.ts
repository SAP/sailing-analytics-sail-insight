import { isEmpty, orderBy, values } from 'lodash'
import { createSelector } from 'reselect'

import { CheckIn, Session } from 'models'
import { mapResToCompetitor } from 'models/Competitor'
import { mapResToEvent } from 'models/Event'
import { mapResToLeaderboard } from 'models/Leaderboard'
import { mapResToRegatta } from 'models/Regatta'

import { getBoatEntity } from './boat'
import { getActiveCheckIns } from './checkIn'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getMarkEntity } from './mark'
import { getRegattaEntity } from './regatta'


export const getSessionList = createSelector(
  getActiveCheckIns,
  getEventEntity,
  getLeaderboardEntity,
  getRegattaEntity,
  getBoatEntity,
  getCompetitorEntity,
  getMarkEntity,
  (
    activeCheckIns,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
  ) => {
    if (!activeCheckIns) {
      return []
    }
    return orderBy(
      values(activeCheckIns).map((checkIn: CheckIn) => {
        if (!checkIn) {
          return checkIn as Session
        }
        const result: Session = { ...checkIn }
        result.event = eventEntity && mapResToEvent(eventEntity[checkIn.eventId])
        result.leaderboard = leaderboardEntity && mapResToLeaderboard(leaderboardEntity[checkIn.leaderboardName])
        result.competitor =
          checkIn.competitorId &&
          competitorEntity &&
          mapResToCompetitor(competitorEntity[checkIn.competitorId])
        result.regatta = regattaEntity && mapResToRegatta(regattaEntity[checkIn.leaderboardName])
        return result
      }),
    )
  },
)


export const isSessionListEmpty = createSelector(
  getSessionList,
  (checkInList: any[]) => isEmpty(checkInList),
)
