import { values, propEq, find } from 'ramda'
import { EVENT_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'
import { createSelector } from 'reselect'

import {
  SelectedEventInfo,
  SelectedRaceInfo,
} from 'models/Event'

export const getEventEntity = (state: any) => getEntities(state, EVENT_ENTITY_NAME)
export const getEvents = (state: any) => getEntityArrayByType(state, EVENT_ENTITY_NAME)
export const getEvent = (eventId: string) => (state: any) => getEntityById(state, EVENT_ENTITY_NAME, eventId)

export const getSelectedEventInfo = createSelector(
    (state: any): string | undefined => state.events.selectedEvent,
    (state: any): any[] => values(state.checkIn.active),
    (selectedEvent, activeCheckIns): SelectedEventInfo | undefined =>
      selectedEvent && find(propEq('eventId', selectedEvent), activeCheckIns),)

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