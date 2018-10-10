import { keys } from 'lodash'
import { createSelector } from 'reselect'

import { RACE_ENTITY_NAME } from 'api/schemas'
import { CheckIn, User } from 'models'
import { ApiBodyKeys as EventApiKeys } from 'models/Event'
import Race, { ApiBodyKeys as RaceApiKeys, mapResToRace } from 'models/Race'
import { ApiBodyKeys as RegattaApiKeys } from 'models/Regatta'
import { removeUserPrefix } from 'services/SessionService'

import { getOrderListFunction } from 'helpers/utils'
import { getUserInfo } from './auth'
import { getActiveCheckInEntity, getCheckInByLeaderboardName } from './checkIn'
import { getEntities } from './entity'
import { getEventEntity } from './event'
import { getRegatta, getRegattaEntity } from './regatta'


const orderRaces = getOrderListFunction<Race>(['startDate', 'trackingStartDate'], 'desc')

const buildRace = (
  apiRace: any,
  checkIn: CheckIn,
  eventEntity: any = {},
  regattaEntity: any = {},
  userInfo?: User,
) => {
  const race = mapResToRace(apiRace)
  return race && race.regattaName ?
    {
      ...race,
      boatClass: regattaEntity[race.regattaName] && regattaEntity[race.regattaName][RegattaApiKeys.BoatClass],
      venueName: checkIn &&
        eventEntity[checkIn.eventId] &&
        eventEntity[checkIn.eventId] &&
        eventEntity[checkIn.eventId][EventApiKeys.Venue][EventApiKeys.VenueName],
      userStrippedDisplayName: removeUserPrefix(userInfo, race.name),
    } as Race :
    race
}


export const getRaceEntity = (state: any) => getEntities(state, RACE_ENTITY_NAME)

export const getRaces = (regattaName: string): (n: string) => Race[] => createSelector(
  getRegatta(regattaName),
  getCheckInByLeaderboardName(regattaName),
  getRegattaEntity,
  getEventEntity,
  getRaceEntity,
  getUserInfo,
  (
    regattaData: any,
    checkIn: CheckIn,
    regattaEntity: any = {},
    eventEntity: any = {},
    raceEntity: any = {},
    userInfo,
  ) =>
    regattaData &&
    regattaData.races &&
    orderRaces(regattaData.races.map((id: string) => buildRace(
      raceEntity[id],
      checkIn,
      eventEntity,
      regattaEntity,
      userInfo,
    ))),
)

// TODO: check if user was tracking a sessions Track?
export const getUserRaces = createSelector(
  getActiveCheckInEntity,
  getRegattaEntity,
  getEventEntity,
  getRaceEntity,
  getUserInfo,
  (
    checkIns: any = {},
    regattaEntity: any = {},
    eventEntity: any = {},
    raceEntity: any = {},
    userInfo,
  ) => {
    return orderRaces(keys(raceEntity).map((id: string) => {
      const apiRace = raceEntity[id]
      return buildRace(
        apiRace,
        checkIns[apiRace && apiRace[RaceApiKeys.Regatta]],
        eventEntity,
        regattaEntity,
        userInfo,
      )
    }))
  },
)
