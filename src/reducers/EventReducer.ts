import { handleActions } from 'redux-actions'
import { selectRace, selectEvent, updateRaceTime } from 'actions/events'

const reducer = handleActions(
  {
    [selectEvent as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedEvent: action.payload.eventId,
      selectedRegatta: action.payload.regattaName
    }),

    [selectRace as any]: (state: any = {}, action: any) => ({
        ...state,
        selectedRace: action.payload,
    }),
    [updateRaceTime as any]: (state: any = {}, action: any) => ({
      ...state,
      raceTimes: {
        ...state.raceTimes,
        ...action.payload
      }
    })
  },
  {},
)

export default reducer
