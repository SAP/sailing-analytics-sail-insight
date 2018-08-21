import { receiveEntities } from 'actions/entities'


export const fetchEntityAction = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: (action: any) => void) => {
    const payload = await requestFunction(...args)
    return payload && dispatch(receiveEntities(payload))
  }
