import { createAction } from 'redux-actions'
import { collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { selfTrackingApi } from 'api'
import { CreateEventBody } from 'api/endpoints/types'
import { ActionQueue } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import { CheckIn } from 'models'
import EventCreationData, { RegattaType } from 'models/EventCreationData'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

export const SELECT_EVENT = 'SELECT_EVENT'
export const SELECT_RACE = 'SELECT_RACE'

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
  ])

export const selectEvent = createAction(SELECT_EVENT)
export const selectRace = createAction(SELECT_RACE)