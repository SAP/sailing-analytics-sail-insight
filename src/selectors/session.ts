import { isEmpty, orderBy, values } from 'lodash'
import { createSelector } from 'reselect'

import { CheckIn, Session } from 'models'
import { mapResToCompetitor } from 'models/Competitor'
import { mapResToEvent } from 'models/Event'
import { EventFilter } from 'models/EventFilter'
import { mapResToLeaderboard } from 'models/Leaderboard'
import { mapResToRegatta } from 'models/Regatta'
import { getEventFilters } from 'selectors/UI'
import { removeUserPrefix } from 'services/SessionService'

import { mapResToBoat } from 'models/Boat'
import { mapResToMark } from 'models/Mark'
import { getUserInfo } from './auth'
import { getBoatEntity } from './boat'
import { getActiveCheckInEntity, getCheckInByLeaderboardName } from './checkIn'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getMarkEntity } from './mark'
import { getRegattaEntity } from './regatta'


const buildSession = (
  checkIn: CheckIn,
  eventEntity: any,
  leaderboardEntity: any,
  regattaEntity: any,
  competitorEntity: any,
  boatEntity: any,
  markEntity: any,
  userInfo: any,
) => {
  const result: Session = { ...checkIn }
  result.event = eventEntity && mapResToEvent(eventEntity[checkIn.eventId])
  result.leaderboard = leaderboardEntity && mapResToLeaderboard(leaderboardEntity[checkIn.leaderboardName])
  result.competitor =
    checkIn.competitorId &&
    competitorEntity &&
    mapResToCompetitor(competitorEntity[checkIn.competitorId])
  result.regatta = regattaEntity && mapResToRegatta(regattaEntity[checkIn.leaderboardName])
  result.userStrippedDisplayName = removeUserPrefix(
    userInfo,
    result.leaderboard && (result.leaderboard.displayName || result.leaderboard.displayName),
  )
  // result.regattaStrippedDisplayName = '',
  result.boat = boatEntity && checkIn.boatId ? mapResToBoat(boatEntity[checkIn.boatId]) : undefined
  result.mark = markEntity && checkIn.markId ? mapResToMark(markEntity[checkIn.markId]) : undefined
  return result
}


export const getSessionList = createSelector(
  getActiveCheckInEntity,
  getEventEntity,
  getLeaderboardEntity,
  getRegattaEntity,
  getCompetitorEntity,
  getBoatEntity,
  getMarkEntity,
  getUserInfo,
  (
    activeCheckIns,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
    boatEntity,
    markEntity,
    userInfo,
  ) => {
    if (!activeCheckIns) {
      return []
    }
    return orderBy(
      values(activeCheckIns).map(checkIn => buildSession(
        checkIn,
        eventEntity,
        leaderboardEntity,
        regattaEntity,
        competitorEntity,
        boatEntity,
        markEntity,
        userInfo,
      )),
      ['event.startDate'],
      ['desc'],
    )
  },
)

export const getSession = (leaderboardName: string) => createSelector(
  getCheckInByLeaderboardName(leaderboardName),
  getEventEntity,
  getLeaderboardEntity,
  getRegattaEntity,
  getCompetitorEntity,
  getBoatEntity,
  getMarkEntity,
  getUserInfo,
  (
    checkIn,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
    boatEntity,
    markEntity,
    userInfo,
  ) => buildSession(
    checkIn,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
    boatEntity,
    markEntity,
    userInfo,
  ),
)


export const isSessionListEmpty = createSelector(
  getSessionList,
  (checkInList: any[]) => isEmpty(checkInList),
)

export const getFilteredSessionList = createSelector(
  getSessionList,
  getEventFilters,
  (sessions: Session[], filters: EventFilter[]) => {
    let filteredSessions = sessions
    if (!filters.includes(EventFilter.Archived)) {
      filteredSessions = filteredSessions.filter(
        (session: Session) => session.event ? !session.event.archived : true
      )
    }
    return filteredSessions
  },
)
