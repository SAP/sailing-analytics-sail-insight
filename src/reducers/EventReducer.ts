import { removeUserData } from 'actions/auth'
import {
  receiveEvent,
  selectEvent,
  selectRace,
  startTracking,
  updateEvent,
  updateEventFilters,
  updateLoadingEventList,
  updateRaceTime,
  updateCreatingEvent,
  updateSelectingEvent,
  updateStartingTracking,
  updateEventPollingStatus,
} from "actions/events";
import { EventFilter } from 'models/EventFilter'
import { path } from 'ramda'
import { EventState } from 'reducers/config'
import { handleActions } from 'redux-actions'
import { itemUpdateHandler } from 'helpers/reducers'

const initialState: EventState = {
  all: {} as Map<string, any>,
  activeFilters: [EventFilter.All],
  raceTimes: {},
  isCreatingEvent: false,
  isSelectingEvent: false,
  isStartingTracking: false,
  isLoadingEventList: false,
  isPollingEvent: false,
} as EventState

const reducer = handleActions(
  {
    [selectEvent as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedEvent: action.payload.data.eventId,
      selectedRegatta: action.payload.data.regattaName,
      isSelectingEvent: true,
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
    [startTracking as any]: (state: any) => ({
      ...state,
      isStartingTracking: true
    }),
    [removeUserData as any]: () => initialState,
    [updateCreatingEvent as any]: itemUpdateHandler('isCreatingEvent'),
    [updateSelectingEvent as any]: itemUpdateHandler('isSelectingEvent'),
    [updateStartingTracking as any]: itemUpdateHandler('isStartingTracking'),
    [updateLoadingEventList as any]: itemUpdateHandler('isLoadingEventList'),
    [updateEventPollingStatus as any]: itemUpdateHandler('isPollingEvent'),
  },
  initialState,
)

export default reducer
