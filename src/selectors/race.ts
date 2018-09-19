import { orderBy } from 'lodash'
import { createSelector } from 'reselect'

import { RACE_ENTITY_NAME } from 'api/schemas'
import Race, { mapResToRace } from 'models/Race'

import { getEntities, getEntityArrayByType } from './entity'
import { getRegatta } from './regatta'


const orderRaces = (races: Race[]) => orderBy(races, ['startDate'], ['desc'])

export const getRaceEntity = (state: any) => getEntities(state, RACE_ENTITY_NAME)

export const getRaces = (regattaName: string): (n: string) => Race[] => createSelector(
  getRegatta(regattaName),
  getRaceEntity,
  (regattaData: any, raceEntity: any) =>
    regattaData &&
    raceEntity &&
    regattaData.races &&
    orderRaces(regattaData.races.map((id: string) => mapResToRace(raceEntity[id]))),
)

// TODO: implement
export const getUserRaces = (state: any) => orderRaces(getEntityArrayByType(state, RACE_ENTITY_NAME).map(mapResToRace))
