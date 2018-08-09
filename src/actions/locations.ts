import { createAction } from 'redux-actions'

import Logger from 'helpers/Logger'
import LocationService from 'services/LocationService'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')

export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const setTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')

export const startLocationTracking = (
  leaderboardName: string,
  eventId: string,
) => (dispatch: (action: any) => void) => {
  LocationService.start()
  dispatch(setTrackedRegatta({
    leaderboardName,
    eventId,
  }))
}

export const stopLocationTracking = () => (dispatch: (action: any) => void) => {
  LocationService.stop()
  dispatch(removeTrackedRegatta())
}

export const handleGPSLocation = (location: any) => (dispatch: (action: any) => void) => {
  Logger.debug(location)
}
