import * as api from 'api'
import { receiveEntities } from './entities'


export const fetchEvent = id => async (dispatch) => {
  const payload = await api.requestEvent(id)
  return payload && dispatch(receiveEntities(payload))
}
