import { createAction } from 'redux-actions'

import LocationService from 'services/LocationService'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')

export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')

export const startLocationTracking = leaderboardName => (dispatch) => {
  LocationService.start()
  dispatch(updateTrackedLeaderboard(leaderboardName))
}

export const stopLocationTracking = () => (dispatch) => {
  LocationService.stop()
  dispatch(updateTrackedLeaderboard(null))
}
