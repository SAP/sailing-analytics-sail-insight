import { reducer as network } from 'react-native-offline'
import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'
import {
  CHECK_IN_REDUCER_NAME,
  ENTITIES_REDUCER_NAME,
  LOCATION_TRACKING_REDUCER_NAME,
  NETWORK_REDUCER_NAME,
} from './config'
import EntityReducer from './EntityReducer'
import LocationTrackingReducer from './LocationTrackingReducer'

interface RootReducer {
  [NETWORK_REDUCER_NAME]: any
  [CHECK_IN_REDUCER_NAME]: any
  [ENTITIES_REDUCER_NAME]: any
  [LOCATION_TRACKING_REDUCER_NAME]: any
}

const reducer: RootReducer = {
  [NETWORK_REDUCER_NAME]: network,
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [LOCATION_TRACKING_REDUCER_NAME]: LocationTrackingReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
}

const reducers = combineReducers(reducer)

export default reducers
