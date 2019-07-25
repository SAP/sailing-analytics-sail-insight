import { find, get, keys } from 'lodash'
import { createSelector } from 'reselect'

import { RACE_ENTITY_NAME } from 'api/schemas'
import { CheckIn, User } from 'models'
import { ApiBodyKeys as EventApiKeys } from 'models/Event'
import Race, { ApiBodyKeys as RaceApiKeys, mapResToRace } from 'models/Race'
import { ApiBodyKeys as RegattaApiKeys } from 'models/Regatta'
import { RootState } from 'reducers/config'
import { removeRegattaPrefix, removeUserPrefix } from 'services/SessionService'

import { getOrderListFunction } from 'helpers/utils'
import { mapResToRaceStats } from 'models/RaceStats'
import { getUserInfo } from './auth'
import { getActiveCheckInEntity, getCheckInByLeaderboardName } from './checkIn'
import { getEntities } from './entity'
import { getEventEntity } from './event'
import { getLeaderboardEntity } from './leaderboard'
import { getRegatta, getRegattaEntity } from './regatta'

export const getCourse = (raceId: string) => (state: RootState) =>
  state.races && state.races.courses[raceId]

export const getCourseLoading = (state: RootState) =>
  state.races && state.races.courseLoading

const orderRaces = getOrderListFunction<Race>(['trackingStartDate'], 'desc')

const getRaceColumnNameFromRegatta = (race: Race, regatta: any, seriesName: string, fleetName: string = 'Default') => {
  const series = find(get(regatta, 'series'), { name: seriesName })
  const trackedRace = find(
    get(find(get(series, 'trackedRaces.fleets'), { name: fleetName }), 'races'),
    { trackedRaceName: race.name },
  )
  return get(trackedRace, 'name')
}

const getLeaderboardStats = (leaderboard: any, competitorId: string, columnName: string) => {
  const competitor = find(get(leaderboard, 'competitors'), { id: competitorId })
  const result = get(competitor, ['columns', columnName, 'data'])
  return result
}

const buildRace = (
  apiRace: any,
  checkIn: CheckIn,
  eventEntity: any = {},
  regattaEntity: any = {},
  leadernboardEntity: any = {},
  userInfo?: User,
) => {
  const race = mapResToRace(apiRace)
  const columnName = race && race.regattaName && getRaceColumnNameFromRegatta(
    race,
    regattaEntity[race.regattaName],
    'Default',
    get(checkIn, 'currentFleet'),
  )
  const stats = checkIn && checkIn.competitorId && getLeaderboardStats(
    get(leadernboardEntity, checkIn.leaderboardName),
    checkIn.competitorId,
    columnName,
  )
  return race && race.regattaName ?
    {
      ...race,
      columnName,
      boatClass: get(regattaEntity, [race.regattaName, RegattaApiKeys.BoatClass]),
      venueName: get(eventEntity, [checkIn && checkIn.eventId, EventApiKeys.Venue, EventApiKeys.VenueName]),
      userStrippedDisplayName: removeUserPrefix(userInfo, race.name),
      regattaStrippedDisplayName: removeRegattaPrefix(race.regattaName, race.name),
      statistics: stats && mapResToRaceStats({
        ...stats,
        columnName,
        id: race.id,
      }),
    } as Race :
    race
}


export const getRaceEntity = (state: any) => getEntities(state, RACE_ENTITY_NAME)

export const getRaces = (regattaName: string) => createSelector(
  getRegatta(regattaName),
  getCheckInByLeaderboardName(regattaName),
  getRegattaEntity,
  getEventEntity,
  getRaceEntity,
  getLeaderboardEntity,
  getUserInfo,
  (
    regattaData: any,
    checkIn: CheckIn,
    regattaEntity: any = {},
    eventEntity: any = {},
    raceEntity: any = {},
    leadernboardEntity: any = {},
    userInfo,
  ) =>
    regattaData &&
    regattaData.races &&
    orderRaces(regattaData.races.map((id: string) => buildRace(
      raceEntity[id],
      checkIn,
      eventEntity,
      regattaEntity,
      leadernboardEntity,
      userInfo,
    ))),
)

// TODO: check if user was tracking a sessions Track?
export const getUserRaces = createSelector(
  getActiveCheckInEntity,
  getRegattaEntity,
  getEventEntity,
  getRaceEntity,
  getLeaderboardEntity,
  getUserInfo,
  (
    checkIns: any = {},
    regattaEntity: any = {},
    eventEntity: any = {},
    raceEntity: any = {},
    leadernboardEntity: any = {},
    userInfo,
  ) => {
    return orderRaces(keys(raceEntity).map((id: string) => {
      const apiRace = raceEntity[id]
      return buildRace(
        apiRace,
        checkIns[apiRace && apiRace[RaceApiKeys.Regatta]],
        eventEntity,
        regattaEntity,
        leadernboardEntity,
        userInfo,
      )
    }))
  },
)
