import { handleActions } from 'redux-actions'

import { updateEvent } from 'actions/events'

import { EventState } from 'reducers/config'


const initialState: EventState = {} as EventState

const reducer = handleActions(
  {
    [updateEvent as any]: (state: any = {}, action?: any) => {
      if (!action || !action.payload) {
        return state
      }

      return {
        ...state,
        ...action.payload,
      }
    },
  },
  initialState,
)

export default reducer
