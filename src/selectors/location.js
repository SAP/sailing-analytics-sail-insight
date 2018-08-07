import { LOCATION_TRACKING_REDUCER_NAME } from 'reducers'


export const getLocationTrackingStatus = state => state?.[LOCATION_TRACKING_REDUCER_NAME]?.status 
