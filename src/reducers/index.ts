import { reducer as network } from 'react-native-offline'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import {
  AUTH_REDUCER_NAME,
  CHECK_IN_REDUCER_NAME,
  ENTITIES_REDUCER_NAME,
  FORM_REDUCER_NAME,
  LOCATION_TRACKING_REDUCER_NAME,
  NETWORK_REDUCER_NAME,
  ONBOARDING_REDUCER_NAME,
  SETTINGS_REDUCER_NAME,
  USER_REDUCER_NAME,
} from './config'

import AuthReducer from './AuthReducer'
import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
import LocationTrackingReducer from './LocationTrackingReducer'
import OnboardingReducer from './OnboardingReducer'
import SettingsReducer from './SettingsReducer'
import UserReducer from './UserReducer'


interface RootReducer {
  [AUTH_REDUCER_NAME]: any
  [NETWORK_REDUCER_NAME]: any
  [CHECK_IN_REDUCER_NAME]: any
  [ENTITIES_REDUCER_NAME]: any
  [LOCATION_TRACKING_REDUCER_NAME]: any,
  [FORM_REDUCER_NAME]: any,
  [ONBOARDING_REDUCER_NAME]: any,
  [SETTINGS_REDUCER_NAME]: any,
  [USER_REDUCER_NAME]: any,
}

const reducer: RootReducer = {
  [AUTH_REDUCER_NAME]: AuthReducer,
  [USER_REDUCER_NAME]: UserReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [FORM_REDUCER_NAME]: formReducer,
  [LOCATION_TRACKING_REDUCER_NAME]: LocationTrackingReducer,
  [ONBOARDING_REDUCER_NAME]: OnboardingReducer,
  [SETTINGS_REDUCER_NAME]: SettingsReducer,
  [NETWORK_REDUCER_NAME]: network,
}

const reducers = combineReducers(reducer)

export default reducers
