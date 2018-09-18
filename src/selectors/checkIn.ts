import { isEmpty, values } from 'lodash'
import { createSelector } from 'reselect'

import { CheckIn, Event, Leaderboard, Race } from 'models'
import { CHECK_IN_REDUCER_NAME } from 'reducers/config'
import { getBoatEntity } from './boat'
import { getCompetitorEntity } from './competitor'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getTrackedEventId, getTrackedLeaderboardName } from './location'
import { getMarkEntity } from './mark'


const getActiveCheckIns = (state: any) =>
  state && state[CHECK_IN_REDUCER_NAME] && state[CHECK_IN_REDUCER_NAME].active


export const getCheckInByLeaderboardName = (leaderboardName?: string) => (state: any = {}) => {
  const data = leaderboardName &&
    state[CHECK_IN_REDUCER_NAME] &&
    state[CHECK_IN_REDUCER_NAME].active &&
    state[CHECK_IN_REDUCER_NAME].active[leaderboardName]
  return data instanceof CheckIn ? data : CheckIn.createInstance(data)
}

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
    competitorEntity,
  ) => {
    if (!activeCheckIns) {
      return []
    }
    return values(activeCheckIns).map((checkIn: any) => {
      const result: CheckIn | null = checkIn instanceof CheckIn ? checkIn : CheckIn.createInstance(checkIn)
      if (!result) {
        return result
      }
      result.event = eventEntity && Event.createInstance(eventEntity[checkIn.eventId])
      result.leaderboard = leaderboardEntity && Leaderboard.createInstance(leaderboardEntity[checkIn.leaderboardName])
      result.event = eventEntity && Event.createInstance(eventEntity[checkIn.eventId])
      result.competior = competitorEntity && competitorEntity[checkIn.competitorId]
      return result
    })
  },
)

export const isCheckInListEmpty = createSelector(
  getCheckInList,
  (checkInList: any[]) => isEmpty(checkInList),
)

export const getTrackedEvent = createSelector(
  getTrackedEventId,
  getEventEntity,
  (eventId, eventEntity) => eventEntity && Event.createInstance(eventEntity[eventId]),
)

export const getTrackedCheckInBaseUrl = (state: any = {}) => {
  const checkIn = getCheckInByLeaderboardName(getTrackedLeaderboardName(state))(state)
  return checkIn && checkIn.serverUrl
}

export const getSessionTracks = (sessionName: string) => createSelector(
  getCheckInByLeaderboardName(sessionName),
  (checkIn: any) => {
    return [
    ]
  },
)

export const getUserTracks = createSelector(
  getCheckInList,
  (checkIns) => {
    // TODO: implement
    return []
  },
)

export const getServerUrl = (leaderboardName?: string) => (state: any) => {
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(state)
  return checkIn && checkIn.serverUrl
}
