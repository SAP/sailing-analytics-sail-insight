import { LOCATION_TRACKING_REDUCER } from 'reducers'


export const getLocationTrackingStatus = state => state?.[LOCATION_TRACKING_REDUCER]?.status
