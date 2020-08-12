import { EVENT_ENTITY_NAME } from 'api/schemas'
import { find, identity, propEq, values, compose, prop } from 'ramda'
import { createSelector } from 'reselect'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'
import { RootState } from 'reducers/config'

import {
  SelectedEventInfo,
  SelectedRaceInfo,
} from 'models/Event'

export const getEventEntity = (state: any) => getEntities(state, 'all', 'events')
export const getEvents = (state: any) => getEntityArrayByType(state, EVENT_ENTITY_NAME)
export const getEvent = (eventId: string) => (state: any) =>
  getEntityById(state, 'all', eventId, { reducerName: 'events' })

export const getActiveEventFilters = (state: any) => state.events.activeFilters

export const getSelectedEventInfo = createSelector(
    (state: any): string | undefined => state.events.selectedEvent,
    (state: any): any[] => values(state.checkIn.active),
    (selectedEvent, activeCheckIns): SelectedEventInfo | undefined =>
      selectedEvent && find(propEq('eventId', selectedEvent), activeCheckIns))

export const getSelectEventEndDate = createSelector(
  (state: any): any[] => values(state.events.all),
  (state: any): string | undefined => state.events.selectedEvent,
  (allEvents, selectedEvent) => 
    selectedEvent && 
    compose(
      prop('endDate'),
      find(propEq('id', selectedEvent))
    )(allEvents)
)

export const getSelectedRaceInfo = createSelector(
  getSelectedEventInfo,
  (state: any): string | undefined => state.events.selectedRace,
  (selectedEvent, selectedRace): SelectedRaceInfo | undefined =>
    selectedEvent &&
    selectedRace && {
      ...selectedEvent,
      raceColumnName: selectedRace,
      fleet: 'Default', // TODO: This has to be the real fleet, but it will work with most cases with 'Default'
    } || undefined,
)

export const getRaceTime = (leaderboard: string, raceName: string) =>
  createSelector((state: any) =>
    state.events.raceTimes[`${leaderboard}-${raceName}`], identity)

export const isCreatingEvent = (state: RootState = {}) =>  {
    return state.events && state.events.isCreatingEvent
}

export const getEventIdThatsBeingSelected = (state: any) =>
  state.events && state.events.isSelectingEvent && state.events.selectedEvent

export const isStartingTracking = (state: any) =>
  !!(state.events && state.events.isStartingTracking)

export const isLoadingEventList = (state: any) =>
  !!(state.events && state.events.isLoadingEventList)

export const isPollingEvent = () => (state: any) =>
  !!(state.events && state.events.isPollingEvent)
