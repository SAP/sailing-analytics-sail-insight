import * as api from 'api'
import { fetchEntityAction } from 'helpers/actions'
import { Dispatch } from 'helpers/types'
import { receiveEntities } from './entities'


export const fetchLeaderboards = () => async (dispatch: Dispatch) => {
  const payload = await api.requestLeaderboards()
  return payload && dispatch(receiveEntities(payload))
}

export const fetchLeaderboard = fetchEntityAction(api.requestLeaderboard)
