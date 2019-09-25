import { handleActions } from 'redux-actions'
import { selectRace, selectEvent } from 'actions/events'

const reducer = handleActions(
  {
    [selectEvent as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedEvent: action.payload,
    }),

    [selectRace as any]: (state: any = {}, action: any) => ({
        ...state,
        selectedRace: action.payload,
    }),
  },
  {},
)

export default reducer
