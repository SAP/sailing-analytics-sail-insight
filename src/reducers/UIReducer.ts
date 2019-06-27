import { handleActions } from 'redux-actions'

import { updateEventFilters } from 'actions/UI'

import { UIState } from 'reducers/config'


const initialState: UIState = {
  eventFilters: []
} as UIState

const reducer = handleActions(
  {
    [updateEventFilters as any]: (state: any = {}, action?: any) => {
      if (!action || !action.payload) {
        return state
      }

      return {
        ...state,
        eventFilters: action.payload,
      }
    },
  },
  initialState,
)

export default reducer
