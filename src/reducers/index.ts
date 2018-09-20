import { reducer as network } from 'react-native-offline'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import {
  CHECK_IN_REDUCER_NAME,
  ENTITIES_REDUCER_NAME,
  FORM_REDUCER_NAME,
  LOCATION_TRACKING_REDUCER_NAME,
  NETWORK_REDUCER_NAME,
  ONBOARDING_REDUCER_NAME,
  SETTINGS_REDUCER_NAME,
} from './config'

import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
import LocationTrackingReducer from './LocationTrackingReducer'
import OnboardingReducer from './OnboardingReducer'
import SettingsReducer from './SettingsReducer'


interface RootReducer {
  [NETWORK_REDUCER_NAME]: any
  [CHECK_IN_REDUCER_NAME]: any
  [ENTITIES_REDUCER_NAME]: any
  [LOCATION_TRACKING_REDUCER_NAME]: any,
  [FORM_REDUCER_NAME]: any,
  [ONBOARDING_REDUCER_NAME]: any,
  [SETTINGS_REDUCER_NAME]: any,
}

const reducer: RootReducer = {
  [NETWORK_REDUCER_NAME]: network,
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [LOCATION_TRACKING_REDUCER_NAME]: LocationTrackingReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
  [FORM_REDUCER_NAME]: formReducer,
  [ONBOARDING_REDUCER_NAME]: OnboardingReducer,
  [SETTINGS_REDUCER_NAME]: SettingsReducer,
}

const reducers = combineReducers(reducer)

export default reducers
