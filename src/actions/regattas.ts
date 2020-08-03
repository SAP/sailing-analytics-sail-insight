import { receiveEntities } from 'actions/entities'
import { fetchEntityAction, withDataApi } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { Race } from 'models'

import { REGATTA_COMPETITORS_ENTITY_NAME } from 'api/schemas'

import { isNetworkConnected } from 'selectors/network'
import { getRaces } from 'selectors/race'

export const fetchRegatta = (regattaName: string, secret?: string, forcedServerUrl?: string) =>
  withDataApi(forcedServerUrl || { secret, leaderboard: regattaName })(async (dataApi, dispatch) => {
    await dispatch(fetchEntityAction(dataApi.requestRegatta)(regattaName, secret))
    await dispatch(fetchEntityAction(dataApi.requestRaces)(regattaName, secret))
  })

export const fetchRegattaRace = (regattaName?: string, raceName?: string, secret?: string) => withDataApi({ secret, leaderboard: regattaName })(
  async (dataApi, dispatch) =>
    regattaName &&
    raceName &&
    dispatch(fetchEntityAction(dataApi.requestRace)(regattaName, raceName)),
)

export const fetchAllRaces = (
  regattaName?: string,
  secret?: string,
  forcedServerUrl?: string,
) => withDataApi(forcedServerUrl || { secret, leaderboard: regattaName })(async (dataApi, dispatch, getState) => {
  if (!regattaName) {
    return
  }
  const races = getRaces(regattaName)(getState())
  if (!races) {
    return
  }
  const raceEntityAction = fetchEntityAction(dataApi.requestRace)
  return Promise.all(races.map((race: Race) => {
    return race && dispatch(raceEntityAction(regattaName, race.name, race.id, secret))
  }))
})

export type FetchRegattaAndRacesAction = (regattaName?: string, secret?: string) => any
export const fetchRegattaAndRaces: FetchRegattaAndRacesAction = (regattaName, secret) => async (dispatch: DispatchType) => {
  if (!regattaName) {
    return
  }
  await dispatch(fetchRegatta(regattaName, secret))
  await dispatch(fetchAllRaces(regattaName, secret))
}

export const fetchRegattaRaceManeuvers = (race: Race, competitorId?: string) => withDataApi(race.regattaName)(
  (dataApi) => {
    if (!race || !race.regattaName || !race.name) {
      return
    }
    return dataApi.requestManeuvers(
      race.regattaName,
      race.name,
      { fromTime: race.startDate, ...(competitorId ? { competitorId } : {}) },
    )
  },
)

export const fetchRegattaCompetitors = (regattaName: string, leaderboard: string) =>
  withDataApi({ leaderboard })(async (dataApi, dispatch, getState) => {
    // Ignore the call if offline
    if (isNetworkConnected(getState())) {
      const data = await dataApi.requestRegattaCompetitors(regattaName)
      dispatch(receiveEntities({ entities: { [REGATTA_COMPETITORS_ENTITY_NAME]: { [regattaName]: data } } }))
    }
  }
  )
