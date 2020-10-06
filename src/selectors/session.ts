import { isEmpty, orderBy, reverse, values } from 'lodash'
import { always, compose, isNil, reject, unless, when } from 'ramda'
import { createSelector } from 'reselect'

import { CheckIn, Session } from 'models'
import { mapResToCompetitor } from 'models/Competitor'
import { mapResToEvent } from 'models/Event'
import { EventFilter } from 'models/EventFilter'
import { mapResToLeaderboard } from 'models/Leaderboard'
import { mapResToRegatta } from 'models/Regatta'
import { getActiveEventFilters } from 'selectors/event'
import { removeUserPrefix } from 'services/SessionService'

import { mapResToBoat } from 'models/Boat'
import { mapResToMark } from 'models/Mark'
import { getUserInfo } from './auth'
import { getBoatEntity } from './boat'
import { getActiveCheckInEntity, getCheckInByLeaderboardName } from './checkIn'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity, isLeaderboardFinished } from './leaderboard'
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
  if (isNil(checkIn)) {
    return null
  }

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
  result.isFinished = isLeaderboardFinished(result.leaderboardName, Object.values(leaderboardEntity))
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
      reverse(values(activeCheckIns).map(checkIn => buildSession(
        checkIn,
        eventEntity,
        leaderboardEntity,
        regattaEntity,
        competitorEntity,
        boatEntity,
        markEntity,
        userInfo,
      ))),
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


export const getFilteredSessionList = (forTracking: any) => createSelector(
  getSessionList,
  getActiveEventFilters,
  (sessions: Session[], filters: EventFilter[]) => compose(
    when(
      always(forTracking),
      reject((session: any) => session.isFinished)),
    unless(
      always(filters.includes(EventFilter.Archived)),
      reject((session: Session) => !!session.isArchived)),
    unless(
      always(filters.includes(EventFilter.All)),
      reject((session: Session) => !session.isArchived)))(
    sessions))

export const isSessionListEmpty = forTracking => createSelector(
  getFilteredSessionList(forTracking),
  (checkInList: any[]) => isEmpty(checkInList))
