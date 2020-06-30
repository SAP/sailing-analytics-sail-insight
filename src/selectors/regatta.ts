import { compose, defaultTo, flatten, head, isNil, last, length, map, path, prop, unless, values } from 'ramda'
import { createSelector } from 'reselect'

import { REGATTA_COMPETITORS_ENTITY_NAME, REGATTA_ENTITY_NAME } from 'api/schemas'
import { getTrackedCheckInRegattaName } from 'selectors/checkIn'
import { getRaceTime } from 'selectors/event'
import { getEntities, getEntityById } from './entity'


export const getRegattaEntity = (state: any) => getEntities(state, REGATTA_ENTITY_NAME)
export const getRegatta = (name: string) => (state: any) => getEntityById(state, REGATTA_ENTITY_NAME, name)

export const getRegattaCompetitorList = (name: string) => (state: any) => {
  const competitorsEntity = path(['entities', REGATTA_COMPETITORS_ENTITY_NAME, name])(state)
  return competitorsEntity ? values(competitorsEntity) : []
}

export const getSelectedRegatta = (state: any) => state.events.selectedRegatta
export const getRegattaPlannedRaces = (name: string) => (state: any) => {
  const regatta = getEntityById(state, REGATTA_ENTITY_NAME, name)

  if (!regatta) {
    return undefined
  }

  return compose(
    flatten,
    map(prop('races')),
    prop('series'))(
    regatta)
}

export const getTrackedRegatta = (state: any) => {
  const regattaName = getTrackedCheckInRegattaName(state)
  return getRegatta(regattaName)(state)
}

export const getTrackedRegattaRankingMetric = createSelector(
  getTrackedRegatta,
  (regatta: any) => regatta && regatta.rankingMetric,
)

export const getRegattaNumberOfRaces = compose(
  length,
  prop('races'),
  head,
  prop('series')
)

export const getLastPlannedRaceTime = (leaderboardName, regattaName) =>
  state => compose(
    unless(isNil, prop('startTimeAsMillis')),
    unless(isNil, raceName => getRaceTime(leaderboardName, raceName)(state)),
    last,
    defaultTo([]),
    getRegattaPlannedRaces(regattaName),
  )(state)
