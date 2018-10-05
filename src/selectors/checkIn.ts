import { createSelector } from 'reselect'

import { CheckIn } from 'models'
import { mapResToEvent } from 'models/Event'
import { CHECK_IN_REDUCER_NAME } from 'reducers/config'

import { getEventEntity } from './event'
import { getTrackedEventId, getTrackedLeaderboardName } from './location'


export const getActiveCheckInEntity = (state: any) =>
  state && state[CHECK_IN_REDUCER_NAME] && state[CHECK_IN_REDUCER_NAME].active


export const getCheckInByLeaderboardName = (leaderboardName?: string) => (state: any = {}) => {
  const data = leaderboardName &&
    state[CHECK_IN_REDUCER_NAME] &&
    state[CHECK_IN_REDUCER_NAME].active &&
    state[CHECK_IN_REDUCER_NAME].active[leaderboardName]
  return data as CheckIn
}


export const getTrackedEvent = createSelector(
  getTrackedEventId,
  getEventEntity,
  (eventId, eventEntity) => eventEntity && mapResToEvent(eventEntity[eventId]),
)

export const getTrackedCheckIn = createSelector(
  getActiveCheckInEntity,
  getTrackedLeaderboardName,
  (checkInEntity = {}, leaderboardName) => checkInEntity[leaderboardName] as CheckIn,
)

export const getTrackedCheckInBaseUrl = createSelector(
  getTrackedCheckIn,
  checkIn => checkIn && checkIn.serverUrl,
)

export const getServerUrl = (leaderboardName?: string) => (state: any) => {
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(state)
  return checkIn && checkIn.serverUrl
}
