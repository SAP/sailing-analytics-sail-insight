import { reducer as network } from 'react-native-offline'
import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
import LocationTrackingReducer from './LocationTrackingReducer'

export const CHECK_IN_REDUCER_NAME = 'checkIn'
export const ENTITIES_REDUCER_NAME = 'entities'
export const LOCATION_TRACKING_REDUCER_NAME = 'locationTracking'
export const NETWORK_REDUCER_NAME = 'network'

interface IRootReducer {
  [NETWORK_REDUCER_NAME]: any
  [CHECK_IN_REDUCER_NAME]: any
  [ENTITIES_REDUCER_NAME]: any
  [LOCATION_TRACKING_REDUCER_NAME]: any
}

const reducer: IRootReducer = {
  [NETWORK_REDUCER_NAME]: network,
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
  [LOCATION_TRACKING_REDUCER_NAME]: LocationTrackingReducer,
}

const reducers = combineReducers(reducer)


export default reducers
