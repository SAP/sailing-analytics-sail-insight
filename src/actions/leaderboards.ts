import * as api from 'api'
import { fetchEntityAction } from 'helpers/actions'
import { receiveEntities } from './entities'


export const fetchLeaderboards = () => async (dispatch: (action: any) => void) => {
  const payload = await api.requestLeaderboards()
  return payload && dispatch(receiveEntities(payload))
}

export const fetchLeaderboard = fetchEntityAction(api.requestLeaderboard)
