import { LOCATION_TRACKING_REDUCER_NAME } from 'reducers/config'


export const getLocationTrackingStatus = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].status

export const getTrackedEventId = (state: any = {}) =>
  state[LOCATION_TRACKING_REDUCER_NAME] && state[LOCATION_TRACKING_REDUCER_NAME].eventId
