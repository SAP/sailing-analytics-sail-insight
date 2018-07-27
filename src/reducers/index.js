import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
import LocationTrackingReducer from './LocationTrackingReducer'

export const CHECK_IN_REDUCER_NAME = 'checkIn'
export const ENTITIES_REDUCER_NAME = 'entities'
export const LOCATION_TRACKING_REDUCER = 'locationTracking'

const reducers = combineReducers({
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
  [LOCATION_TRACKING_REDUCER]: LocationTrackingReducer,
})


export default reducers
