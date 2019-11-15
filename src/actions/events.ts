import { createAction } from 'redux-actions'

import { Session } from 'models'

import { fetchAction } from 'helpers/actions'

import { collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { selfTrackingApi } from 'api'
import { CreateEventBody } from 'api/endpoints/types'
import { ActionQueue } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import { CheckIn } from 'models'
import EventCreationData, { RegattaType } from 'models/EventCreationData'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

export const CREATE_EVENT = 'CREATE_EVENT'
export const SELECT_EVENT = 'SELECT_EVENT'
export const SELECT_RACE = 'SELECT_RACE'
export const UPDATE_RACE_TIME = 'UPDATE_RACE_TIME'
export const SET_RACE_TIME = 'SET_RACE_TIME'
export const ADD_RACE_COLUMNS = 'ADD_RACE_COLUMNS'
export const REMOVE_RACE_COLUMNS = 'REMOVE_RACE_COLUMNS'

export const updateEvent = createAction('UPDATE_EVENT')
export const receiveEvent = createAction('RECEIVE_EVENT')
export const updateEventFilters = createAction('UPDATE_EVENT_FILTERS')

export const fetchEvent = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: DispatchType) => {
    return await dispatch(fetchAction(requestFunction, receiveEvent)(...args))
  }

export const archiveEvent = (session: Session, archived: boolean) => (
  dispatch: DispatchType,
) => {
  const eventId = session.eventId || session.event && session.event.id

  if (!eventId) {
    return
  }

  const payload = {
    id: eventId,
    data: {
      archived
    },
  }

  dispatch(updateEvent(payload))
}

const mapRegattaTypeToApiConstant = (regattaType: RegattaType) => ({
  [RegattaType.OneDesign]: 'ONE_DESIGN',
  [RegattaType.Handicap]:  'TIME_ON_TIME_AND_DISTANCE',
})[regattaType]

const createEvent = (eventData: EventCreationData) => async () => {
  const secret = getSharingUuid()
  const response = await selfTrackingApi().createEvent({
    secret,
    eventName:                  eventData.name,
    venuename:                  eventData.location,
    competitorRegistrationType: 'OPEN_UNMODERATED', // To be dynamic in the FUTURE
    createleaderboardgroup:     true,
    createregatta:              true,
    numberofraces:              eventData.numberOfRaces,
    leaderboardDiscardThresholds: eventData.discards,
    rankingMetric: mapRegattaTypeToApiConstant(eventData.regattaType),
    boatclassname:
      eventData.regattaType === RegattaType.OneDesign
        ? eventData.boatClass
        : 'Handicap', // Proxy boat class
    ...(eventData.dateFrom ? { startdate: new Date(eventData.dateFrom).toISOString() } : {}),
    ...(eventData.dateTo   ? { enddate: new Date(eventData.dateTo).toISOString() } : {}),
  } as CreateEventBody)
  return eventCreationResponseToCheckIn(response, {
    secret,
    trackPrefix: 'R',
    leaderboardName: eventData.name,
    numberOfRaces: eventData.numberOfRaces
  })
}

export const createEventActionQueue = (eventData: EventCreationData) => (
  dispatch: DispatchType,
) =>
  ActionQueue.create(dispatch, [
    createEvent(eventData),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      collectCheckInData(data),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      updateCheckIn(data),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      createAction(CREATE_EVENT)(data),
    )
  ])

export const updateEventSettings = (session: object, data: object) => (dispatch: DispatchType, getState) => {
  const regattaRaces = getRegattaPlannedRaces(session.regattaName)(getState())

  const sessionData = {
    regattaName: session.regattaName,
    leaderboardName: session.leaderboardName,
    prefix: session.trackPrefix,
    serverUrl: session.serverUrl,
    existingNumberOfRaces: regattaRaces.length
  }

  if (regattaRaces.length < data.numberOfRaces) {
    dispatch(createAction(ADD_RACE_COLUMNS)({
      ...sessionData,
      numberofraces: data.numberOfRaces - regattaRaces.length
    }))
  } else if (regattaRaces.length > data.numberOfRaces) {
    dispatch(createAction(REMOVE_RACE_COLUMNS)({
      ...sessionData,
      numberofraces: regattaRaces.length - data.numberOfRaces
    }))
  }
}

export const selectEvent = createAction(SELECT_EVENT)
export const selectRace = createAction(SELECT_RACE)
export const setRaceTime = createAction(SET_RACE_TIME)
export const updateRaceTime = createAction(UPDATE_RACE_TIME)
