import { receiveEntities } from 'actions/entities'
import { DispatchType } from './types'


export const fetchEntityAction = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: DispatchType) => {
    const payload = await requestFunction(...args)
    return payload && dispatch(receiveEntities(payload))
  }
