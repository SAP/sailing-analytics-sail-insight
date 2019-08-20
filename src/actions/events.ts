import { collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { selfTrackingApi } from 'api'
import { CreateEventBody } from 'api/endpoints/types'
import { ActionQueue } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getSharingUuid } from 'helpers/uuid'
import { CheckIn } from 'models'
import EventCreationData, {
  HandicapRatingSystem,
  RegattaType
} from 'models/EventCreationData'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'

const mapRatingSystemToApiConstant = (ratingSystem: HandicapRatingSystem) => ({
  [HandicapRatingSystem.ORCPerformanceCurve]: 'ORC_PERFORMANCE_CURVE',
  [HandicapRatingSystem.TimeOnTimeAndDistance]: 'TIME_ON_TIME_AND_DISTANCE',
})[ratingSystem]

const regattaTypeAndBoatClassSettings = (eventData: EventCreationData) =>
  eventData.regattaType === RegattaType.OneDesign
    ? {
        rankingMetric: 'ONE_DESIGN',
        boatclassname: eventData.boatClass,
      }
    : {
        rankingMetric: mapRatingSystemToApiConstant(eventData.ratingSystem),
        boatclassname: 'ORC', // Proxy boat class
    }

export const createEvent = (eventData: EventCreationData) => async (
  dispatch: DispatchType,
) => {
  const secret = getSharingUuid()
  const response = await selfTrackingApi().createEvent({
    secret,
    eventName:                  eventData.name,
    venuename:                  eventData.location,
    competitorRegistrationType: 'OPEN_UNMODERATED', // To be dynamic in the FUTURE
    createleaderboardgroup:     true,
    createregatta:              true,
    numberofraces:              eventData.numberOfRaces,
    leaderboardDiscardThresholds: eventData.discardsStart - 1,
    ...regattaTypeAndBoatClassSettings(eventData),
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
