import { receiveEntities } from 'actions/entities'


export const fetchEntityAction = requestFunction => (...args) => async (dispatch) => {
  const payload = await requestFunction(...args)
  return payload && dispatch(receiveEntities(payload))
}
