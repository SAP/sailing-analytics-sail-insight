import { fetchEntityAction, withDataApi } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { Race } from 'models'
import { getRaces } from 'selectors/race'


export const fetchRegatta = (regattaName: string, forcedServerUrl?: string) =>
  withDataApi(forcedServerUrl || { leaderboard: regattaName })(async (dataApi, dispatch) => {
    await dispatch(fetchEntityAction(dataApi.requestRegatta)(regattaName))
    await dispatch(fetchEntityAction(dataApi.requestRaces)(regattaName))
  })

export const fetchRegattaRace = (regattaName?: string, raceName?: string) => withDataApi({ leaderboard: regattaName })(
  async (dataApi, dispatch) =>
    regattaName &&
    raceName &&
    dispatch(fetchEntityAction(dataApi.requestRace)(regattaName, raceName)),
)

export const fetchAllRaces = (
  regattaName?: string,
  forcedServerUrl?: string,
) => withDataApi(forcedServerUrl || { leaderboard: regattaName })(async (dataApi, dispatch, getState) => {
  if (!regattaName) {
    return
  }
  const races = getRaces(regattaName)(getState())
  if (!races) {
    return
  }
  const raceEntityAction = fetchEntityAction(dataApi.requestRace)
  return Promise.all(races.map((race: Race) => {
    return race && dispatch(raceEntityAction(regattaName, race.name, race.id))
  }))
})

export type FetchRegattaAndRacesAction = (regattaName?: string) => any
export const fetchRegattaAndRaces: FetchRegattaAndRacesAction = regattaName => async (dispatch: DispatchType) => {
  if (!regattaName) {
    return
  }
  await dispatch(fetchRegatta(regattaName))
  await dispatch(fetchAllRaces(regattaName))
}
