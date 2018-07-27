import { receiveEntities } from 'actions/entities'


export const fetchEntityFunction = requestFunction => (...args) => async (dispatch) => {
  const payload = await requestFunction(...args)
  return payload && dispatch(receiveEntities(payload))
}
