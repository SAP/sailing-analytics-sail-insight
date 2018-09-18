import { createSelector } from 'reselect'

import { RACE_ENTITY_NAME, REGATTA_ENTITY_NAME } from 'api/schemas'
import Race, { mapResToModel } from 'models/Race'
import { getEntities, getEntityById } from './entity'


export const getRegattaEntity = (state: any) => getEntities(state, REGATTA_ENTITY_NAME)
export const getRaceEntity = (state: any) => getEntities(state, RACE_ENTITY_NAME)
export const getRegatta = (name: string) => (state: any) => getEntityById(state, REGATTA_ENTITY_NAME, name)

export const getRaces = (regattaName: string): (n: string) => Race[] => createSelector(
  getRegatta(regattaName),
  getRaceEntity,
  (regattaData: any, raceEntity: any) =>
    regattaData &&
    raceEntity &&
    regattaData.races &&
    regattaData.races.map((id: string) => mapResToModel(raceEntity[id])),
)
