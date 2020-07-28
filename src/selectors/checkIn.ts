import { any, chain, compose, findLast, isNil, not, path, prop, propEq,
  values, defaultTo, reject } from 'ramda'
import { createSelector } from 'reselect'
import { CheckIn } from 'models'
import { mapResToEvent } from 'models/Event'
import { RootState } from 'reducers/config'
import { getBoat } from '../selectors/boat'
import { getCompetitor } from '../selectors/competitor'
import { getEventEntity } from './event'
import { getTrackedEventId, getTrackedLeaderboardName } from './location'
import { getMark, getMarkEntity } from './mark'

export const getActiveCheckInEntity = (state: RootState = {}) =>
  state.checkIn && state.checkIn.active

export const areThereActiveCheckIns = createSelector(
  getActiveCheckInEntity,
  (checkInEntity = {}) => Object.keys(checkInEntity).length > 0
)


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
    reject(checkIn => !!checkIn.isArchived),
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

export const checkInObjectToText = checkInData => state => {
  const constructString = (objectType: string, selector: any) => {
    const obj = selector(state)
    const { name } = obj || {}
    if (name) return `the ${objectType} "${name}"`
    return `a ${objectType}`
  }

  const { competitorId, markId, boatId } = checkInData

  if (competitorId) {
    return constructString('competitor', getCompetitor(competitorId))
  }

  if (markId) {
    return constructString('mark', getMark(markId))
  }

  if (boatId) {
    return constructString('boat', getBoat(boatId))
  }
}
