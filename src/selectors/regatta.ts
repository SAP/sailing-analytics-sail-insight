import { prop, map, flatten, compose } from 'ramda'
import { createSelector } from 'reselect'

import { REGATTA_ENTITY_NAME } from 'api/schemas'
import { getTrackedCheckInRegattaName } from 'selectors/checkIn'
import { getEntities, getEntityById } from './entity'


export const getRegattaEntity = (state: any) => getEntities(state, REGATTA_ENTITY_NAME)
export const getRegatta = (name: string) => (state: any) => getEntityById(state, REGATTA_ENTITY_NAME, name)

export const getSelectedRegatta = (state: any) => state.events.selectedRegatta
export const getRegattaPlannedRaces = (name: string) => (state: any) => {
  const regatta = getEntityById(state, REGATTA_ENTITY_NAME, name)

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
  (regatta: any) => regatta && regatta.rankingMetric
)
