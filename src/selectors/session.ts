import { isEmpty, orderBy, values } from 'lodash'
import { createSelector } from 'reselect'

import { CheckIn, Session } from 'models'
import { mapResToCompetitor } from 'models/Competitor'
import { mapResToEvent } from 'models/Event'
import { mapResToLeaderboard } from 'models/Leaderboard'
import { mapResToRegatta } from 'models/Regatta'
import { removeUserPrefix } from 'services/SessionService'

import { getUserInfo } from './auth'
import { getActiveCheckIns, getCheckInByLeaderboardName } from './checkIn'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getRegattaEntity } from './regatta'


const buildSession = (
  checkIn: CheckIn,
  eventEntity: any,
  leaderboardEntity: any,
  regattaEntity: any,
  competitorEntity: any,
  userInfo: any,
) => {
  if (!checkIn) {
    return
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
  return result
}


export const getSessionList = createSelector(
  getActiveCheckIns,
  getEventEntity,
  getLeaderboardEntity,
  getRegattaEntity,
  getCompetitorEntity,
  getUserInfo,
  (
    activeCheckIns,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
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
        userInfo,
      )),
    )
  },
)

export const getSession = (leaderboardName: string) => createSelector(
  getCheckInByLeaderboardName(leaderboardName),
  getEventEntity,
  getLeaderboardEntity,
  getRegattaEntity,
  getCompetitorEntity,
  getUserInfo,
  (
    checkIn,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
    userInfo,
  ) => buildSession(
    checkIn,
    eventEntity,
    leaderboardEntity,
    regattaEntity,
    competitorEntity,
    userInfo,
  ),
)


export const isSessionListEmpty = createSelector(
  getSessionList,
  (checkInList: any[]) => isEmpty(checkInList),
)
