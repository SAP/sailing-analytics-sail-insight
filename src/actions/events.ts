import { createAction } from 'redux-actions'

import { CheckIn, Session } from 'models'

import { ActionQueue, fetchAction } from 'helpers/actions'

import { collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { selfTrackingApi } from 'api'
import { CreateEventBody } from 'api/endpoints/types'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import EventCreationData, { RegattaType } from 'models/EventCreationData'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

export const CREATE_EVENT = 'CREATE_EVENT'
export const UPDATE_CREATING_EVENT = 'UPDATE_CREATING_EVENT'
export const UPDATE_SELECTING_EVENT = 'UPDATE_SELECTING_EVENT'
export const UPDATE_STARTING_TRACKING = 'UPDATE_STARTING_TRACKING'
export const SELECT_EVENT = 'SELECT_EVENT'
export const SELECT_RACE = 'SELECT_RACE'
export const UPDATE_RACE_TIME = 'UPDATE_RACE_TIME'
export const FETCH_RACES_TIMES_FOR_EVENT = 'FETCH_RACES_TIMES_FOR_EVENT'
export const SET_RACE_TIME = 'SET_RACE_TIME'
export const ADD_RACE_COLUMNS = 'ADD_RACE_COLUMNS'
export const REMOVE_RACE_COLUMNS = 'REMOVE_RACE_COLUMNS'
export const SET_DISCARDS = 'SET_DISCARDS'
export const OPEN_SAP_ANALYTICS_EVENT = 'OPEN_SAP_ANALYTICS_EVENT'
export const OPEN_EVENT_LEADERBOARD = 'OPEN_EVENT_LEADERBOARD'
export const START_TRACKING = 'START_TRACKING'
export const STOP_TRACKING = 'STOP_TRACKING'

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
      archived,
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
    ispublic:                   false,
    competitorRegistrationType: 'OPEN_UNMODERATED',
    createleaderboardgroup:     true,
    createregatta:              true,
    numberofraces:              eventData.numberOfRaces,
    leaderboardDiscardThresholds: eventData.discards,
    rankingMetric: mapRegattaTypeToApiConstant(eventData.regattaType),
    boatclassname:
      eventData.regattaType === RegattaType.OneDesign
        ? eventData.boatClass
        : null,
    ...(eventData.dateFrom ? { startdate: eventData.dateFrom.toISOString() } : {}),
    ...(eventData.dateTo   ? { enddate: eventData.dateTo.toISOString() } : {}),
  } as CreateEventBody)
  console.log('create event response', response)
  return eventCreationResponseToCheckIn(response, {
    secret,
    trackPrefix: 'R',
    leaderboardName: eventData.name,
    numberOfRaces: eventData.numberOfRaces,
  })
}

export const createEventActionQueue = ({ eventData, navigation }: any) => (
  dispatch: DispatchType,
) =>
  ActionQueue.create(dispatch, [
    updateCreatingEvent(true),
    createEvent(eventData),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      collectCheckInData(data),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      updateCheckIn(data),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      createAction(CREATE_EVENT)({ ...data, navigation }),
    ),
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

export const updateCreatingEvent = createAction(UPDATE_CREATING_EVENT)
export const updateSelectingEvent = createAction(UPDATE_SELECTING_EVENT)
export const updateStartingTracking = createAction(UPDATE_STARTING_TRACKING)
export const selectEvent = createAction(SELECT_EVENT)
export const selectRace = createAction(SELECT_RACE)
export const setRaceTime = createAction(SET_RACE_TIME)
export const fetchRacesTimesForEvent = createAction(FETCH_RACES_TIMES_FOR_EVENT)
export const updateRaceTime = createAction(UPDATE_RACE_TIME)
export const setDiscards = createAction(SET_DISCARDS)
export const openSAPAnalyticsEvent = createAction(OPEN_SAP_ANALYTICS_EVENT)
export const openEventLeaderboard = createAction(OPEN_EVENT_LEADERBOARD)
export const startTracking = createAction(START_TRACKING)
export const stopTracking = createAction(STOP_TRACKING)
