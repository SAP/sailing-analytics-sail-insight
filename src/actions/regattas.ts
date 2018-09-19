import api from 'api'
import { fetchEntityAction } from 'helpers/actions'
import { DispatchType, GetStateType } from 'helpers/types'
import { Race } from 'models'
import { getServerUrl } from 'selectors/checkIn'
import { getRaces } from 'selectors/race'


export const fetchRegatta = (regattaName: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const serverUrl = getServerUrl(regattaName)(getState())
  if (!serverUrl) {
    return
  }
  await dispatch(fetchEntityAction(api(serverUrl).requestRegatta)(regattaName))
  await dispatch(fetchEntityAction(api(serverUrl).requestRaces)(regattaName))
}

export const fetchRegattaRace =
  (regattaName?: string, raceName?: string) => async (dispatch: DispatchType, getState: GetStateType) => {
    const serverUrl = getServerUrl(regattaName)(getState())
    if (!serverUrl || !regattaName || !raceName) {
      return
    }
    await dispatch(fetchEntityAction(api(serverUrl).requestRace)(regattaName, raceName))
  }

export const fetchAllRaces = (regattaName?: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const serverUrl = getServerUrl(regattaName)(state)
  if (!serverUrl || !regattaName) {
    return
  }
  const races = getRaces(regattaName)(state)
  if (!races) {
    return
  }
  const raceEntityAction = fetchEntityAction(api(serverUrl).requestRace)
  return Promise.all(races.map((race: Race) => {
    return race && dispatch(raceEntityAction(regattaName, race.name, race.id))
  }))
}
