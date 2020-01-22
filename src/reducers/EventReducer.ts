import { removeUserData } from 'actions/auth'
import { receiveEvent, selectEvent, selectRace, updateEvent, updateEventFilters, updateRaceTime } from 'actions/events'
import { EventFilter } from 'models/EventFilter'
import { path } from 'ramda'
import { EventState } from 'reducers/config'
import { handleActions } from 'redux-actions'

const initialState: EventState = {
  all: {} as Map<string, any>,
  activeFilters: [EventFilter.All],
  raceTimes: {},
} as EventState

const reducer = handleActions(
  {
    [selectEvent as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedEvent: action.payload.eventId,
      selectedRegatta: action.payload.regattaName,
    }),
    [selectRace as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedRace: action.payload,
    }),
    [updateRaceTime as any]: (state: any = {}, action: any) => ({
      ...state,
      raceTimes: {
        ...state.raceTimes,
        ...action.payload,
      },
    }),
    [receiveEvent as any]: (state: any = {}, action: any) => {
      const event = action && path(['payload', 'entities', 'event'], action)
      if (!event) {
        return state
      }
      return {
        ...state,
        all: {
          ...state.all,
          ...event,
        },
      }
    },
    [updateEvent as any]: (state: any = {}, action?: any) => {
      const { id, data } = action && action.payload || {}
      if (!id || !data) {
        return state
      }
      return {
        ...state,
        all: {
          ...state.all,
          [id]: {
            ...(state.all[id] || {}),
            ...data,
          },
        },
      }
    },
    [updateEventFilters as any]: (state: any = {}, action?: any) => {
      if (!action || !action.payload) {
        return state
      }
      return {
        ...state,
        activeFilters: action.payload,
      }
    },
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
