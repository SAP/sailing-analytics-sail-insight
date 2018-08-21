import { receiveEntities } from 'actions/entities'
import { Dispatch } from './types'


export const fetchEntityAction = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: Dispatch) => {
    const payload = await requestFunction(...args)
    return payload && dispatch(receiveEntities(payload))
  }
