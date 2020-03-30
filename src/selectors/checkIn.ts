import { any, chain, compose, findLast, isNil, not, path, prop, propEq,
  values, defaultTo } from 'ramda'
import { createSelector } from 'reselect'
import { CheckIn } from 'models'
import { mapResToEvent } from 'models/Event'
import { RootState } from 'reducers/config'
import { getEventEntity } from './event'
import { getTrackedEventId, getTrackedLeaderboardName } from './location'
import { getMarkEntity } from './mark'

export const getActiveCheckInEntity = (state: RootState = {}) =>
  state.checkIn && state.checkIn.active


export const getCheckInByLeaderboardName = (leaderboardName?: string) => (state: RootState = {}) => {
  const data = leaderboardName &&
    state.checkIn &&
    state.checkIn.active &&
    state.checkIn.active[leaderboardName]
  return data as CheckIn
}

export const currentUserIsCompetitorForEvent = (leaderboardName: string) => createSelector(
  getCheckInByLeaderboardName(leaderboardName),
  compose(
    not, isNil,
    prop('competitorId')))

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

export const getTrackedCheckInCompetitorId = createSelector(
  getTrackedCheckIn,
  checkIn => checkIn && checkIn.competitorId,
)

export const getTrackedCheckInRegattaName = createSelector(
  getTrackedCheckIn,
  checkIn => checkIn && checkIn.regattaName,
)

export const getTrackedCheckInBaseUrl = createSelector(
  getTrackedCheckIn,
  checkIn => checkIn && checkIn.serverUrl,
)

export const getServerUrl = (leaderboardName?: string) => (state: any) => {
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(state)
  return checkIn && checkIn.serverUrl
}

const isMarkBinding =  compose(
  not,
  isNil,
  prop('markId')
)

export const getMarkBindingCheckIn = createSelector(
  getActiveCheckInEntity,
  compose(
    findLast(isMarkBinding),
    values,
    defaultTo({})
  )
)

export const isBoundToMark = createSelector(
  getMarkBindingCheckIn,
  compose(not, isNil)
)

export const getBoundMarkEntity = createSelector(
  getMarkBindingCheckIn,
  getMarkEntity,
  (markCheckIn, marks) =>
    markCheckIn &&
    markCheckIn.markId &&
    compose(
      prop(markCheckIn.markId),
      defaultTo({})
    )(marks)
)

export const getNameOfBoundMark = createSelector(
  getBoundMarkEntity,
  compose(
    prop('name'),
    defaultTo({}),
  )
)

export const getMarkPropertiesIdOfBoundMark = createSelector(
  getBoundMarkEntity,
  compose(
    prop('originatingMarkPropertiesId'),
    defaultTo({}),
  )
)

export const isLoadingCheckIn = (state: RootState = {}) => state.checkIn && state.checkIn.isLoadingCheckIn
export const isLoadingSplash = (state: RootState = {}) => state.checkIn && state.checkIn.isLoadingSplash
export const isDeletingMarkBinding = (state: RootState = {}) => state.checkIn && state.checkIn.isDeletingMarkBinding
