import { collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { selfTrackingApi } from 'api'
import { ActionQueue } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import { CheckIn } from 'models'
import EventCreationData from 'models/EventCreationData'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

export const createEvent = (eventData: EventCreationData) => async (
  dispatch: DispatchType,
) => {
  const secret = getSharingUuid()
  const response = await selfTrackingApi().createEvent({
    secret,
    eventName:                  eventData.name,
    boatclassname:              eventData.boatClass,
    venuename:                  eventData.location,
    competitorRegistrationType: 'OPEN_UNMODERATED', // To be dynamic in the FUTURE
    createleaderboardgroup:     true,
    createregatta:              true,
    numberofraces:              eventData.numberOfRaces,
    ...(eventData.dateFrom ? { startdate: new Date(eventData.dateFrom).toISOString() } : {}),
    ...(eventData.dateTo   ? { enddate: new Date(eventData.dateTo).toISOString() } : {}),
  })
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
