import { createSelector } from 'reselect'

import { CheckIn } from 'models'
import { mapResToEvent } from 'models/Event'
import { RootState } from 'reducers/config'

import { getEventEntity } from './event'
import { getTrackedEventId, getTrackedLeaderboardName } from './location'


export const getActiveCheckInEntity = (state: RootState = {}) =>
  state.checkIn && state.checkIn.active


export const getCheckInByLeaderboardName = (leaderboardName?: string) => (state: RootState = {}) => {
  const data = leaderboardName &&
    state.checkIn &&
    state.checkIn.active &&
    state.checkIn.active[leaderboardName]
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

export const isLoadingCheckIn = (state: RootState = {}) => state.checkIn && state.checkIn.isLoadingCheckIn
