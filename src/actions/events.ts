import { createAction } from 'redux-actions'
import moment from 'moment'

import { CheckIn, Session } from 'models'

import { ActionQueue, fetchAction } from 'helpers/actions'

import { collectCheckInData, fetchEventList, updateCheckInAndEventInventory } from 'actions/checkIn'
import { selfTrackingApi } from 'api'
import { getApiServerUrl } from 'api/config'
import { CreateEventBody } from 'api/endpoints/types'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import EventCreationData, { RegattaType } from 'models/EventCreationData'
import EventCreatedSetupIncompleteException from 'helpers/EventCreatedSetupIncompleteException'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

export const CREATE_EVENT = 'CREATE_EVENT'
export const UPDATE_CREATING_EVENT = 'UPDATE_CREATING_EVENT'
export const UPDATE_LOADING_EVENT_LIST = 'UPDATE_LOADING_EVENT_LIST'
export const UPDATE_SELECTING_EVENT = 'UPDATE_SELECTING_EVENT'
export const START_POLLING_SELECTED_EVENT = 'START_POLLING_SELECTED_EVENT'
export const STOP_POLLING_SELECTED_EVENT = 'STOP_POLLING_SELECTED_EVENT'
export const UPDATE_EVENT_POLLING_STATUS = 'UPDATE_EVENT_POLLING_STATUS'
export const UPDATE_STARTING_TRACKING = 'UPDATE_STARTING_TRACKING'
export const SELECT_EVENT = 'SELECT_EVENT'
export const SELECT_RACE = 'SELECT_RACE'
export const UPDATE_RACE_TIME = 'UPDATE_RACE_TIME'
export const FETCH_RACES_TIMES_FOR_EVENT = 'FETCH_RACES_TIMES_FOR_EVENT'
export const SET_RACE_TIME = 'SET_RACE_TIME'
export const ADD_RACE_COLUMNS = 'ADD_RACE_COLUMNS'
export const REMOVE_RACE_COLUMNS = 'REMOVE_RACE_COLUMNS'
export const SET_NUMBER_OF_RACES = 'SET_NUMBER_OF_RACES'
export const UPDATE_SAVING_RACE_SETTINGS = 'UPDATE_SAVING_RACE_SETTINGS'
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

export const archiveEvent = (session: Session, isArchived: boolean) => updateCheckInAndEventInventory({
  isArchived,
  leaderboardName: session.leaderboardName,
})

const mapRegattaTypeToApiConstant = (regattaType: RegattaType) => ({
  [RegattaType.OneDesign]: 'ONE_DESIGN',
  [RegattaType.Handicap]:  'TIME_ON_TIME_AND_DISTANCE',
})[regattaType]

const createEvent = (eventData: EventCreationData) => async () => {
  const secret = getSharingUuid()

  const { dateFrom } = eventData
  const startdate = moment().isSame(dateFrom, 'day') ? moment().toISOString() : dateFrom.toISOString()

  const response = await selfTrackingApi().createEvent({
    secret,
    startdate,
    baseurl:                    getApiServerUrl(),
    enddate:                    eventData.dateTo.toISOString(),
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
  } as CreateEventBody)

  return eventCreationResponseToCheckIn(response, {
    secret,
    trackPrefix: 'R',
    leaderboardName: eventData.name,
    numberOfRaces: eventData.numberOfRaces,
  })
}

// Once the createEvent POST succeeded the event exists on the server. A failure
// of any later step must not look like a failed creation (the user would retry
// and create a duplicate), so it is wrapped and shown as "setup incomplete".
const afterEventCreated = (step: any) => async (dispatch: DispatchType) => {
  try {
    return await dispatch(step)
  } catch (error) {
    // the event now exists, so make it show up in the list
    try {
      await dispatch(fetchEventList())
    } catch (e) {
      // best effort
    }
    throw new EventCreatedSetupIncompleteException(error)
  }
}

export const createEventActionQueue = ({ eventData, navigation }: any) => (
  dispatch: DispatchType,
) =>
  ActionQueue.create(dispatch, [
    updateCreatingEvent(true),
    createEvent(eventData),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      afterEventCreated(collectCheckInData(data)),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      afterEventCreated(updateCheckInAndEventInventory(data)),
    ),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) =>
      createAction(CREATE_EVENT)({ ...data, navigation }),
    ),
  ])

// The race count is reconciled in the events saga against the freshly fetched
// server state (changes are queued and run one after the other), so the diff
// is never computed from a stale local race list.
export const updateEventSettings = (session: any, data: any) => (dispatch: DispatchType) =>
  dispatch(createAction(SET_NUMBER_OF_RACES)({
    regattaName: session.regattaName,
    leaderboardName: session.leaderboardName,
    prefix: session.trackPrefix,
    serverUrl: session.serverUrl,
    numberOfRaces: data.numberOfRaces,
  }))

export const updateCreatingEvent = createAction(UPDATE_CREATING_EVENT)
export const updateLoadingEventList = createAction(UPDATE_LOADING_EVENT_LIST)
export const updateSelectingEvent = createAction(UPDATE_SELECTING_EVENT)
export const startPollingSelectedEvent = createAction(START_POLLING_SELECTED_EVENT)
export const stopPollingSelectedEvent = createAction(STOP_POLLING_SELECTED_EVENT)
export const updateEventPollingStatus = createAction(UPDATE_EVENT_POLLING_STATUS)
export const updateSavingRaceSettings = createAction(UPDATE_SAVING_RACE_SETTINGS)
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
// Resolves with true once tracking was started (false if it failed), so callers
// can wait for the result before e.g. navigating to the analytics.
export const startTrackingAndWait = (session: any) => (dispatch: DispatchType) =>
  new Promise<boolean>(resolve => dispatch(startTracking({ ...session, onDone: resolve })))
export const stopTracking = createAction(STOP_TRACKING)
