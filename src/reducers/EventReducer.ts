import { get } from 'lodash'
import { handleActions } from 'redux-actions'

import { receiveEvent, updateEvent, updateEventFilters } from 'actions/events'

import { removeUserData } from 'actions/auth'
import { EventState } from 'reducers/config'


const initialState: EventState = {
  all: {} as Map<string, any>,
  activeFilters: [],
} as EventState

const reducer = handleActions(
  {
    [receiveEvent as any]: (state: any = {}, action: any) => {
      const event = action && get(action, ['payload', 'entities', 'event'])
      if (!event) {
        return state
      }

      return {
        ...state,
        all: {
          ...state.all,
          ...event
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
          }
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
