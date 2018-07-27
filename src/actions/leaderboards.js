import * as api from 'api'
import { fetchEntityFunction } from 'helpers/actions'
import { receiveEntities } from './entities'


export const fetchLeaderboards = () => async (dispatch) => {
  const payload = await api.requestLeaderboards()
  return payload && dispatch(receiveEntities(payload))
}

export const fetchLeaderboard = fetchEntityFunction(api.requestLeaderboard)
