import * as api from 'api'
import { receiveEntities } from './entities'


export const fetchLeaderboards = () => async (dispatch) => {
  const payload = await api.requestLeaderboards()
  return payload && dispatch(receiveEntities(payload))
}

export const fetchLeaderboard = id => async (dispatch) => {
  const payload = await api.requestLeaderboard(id)
  return payload && dispatch(receiveEntities(payload))
}
