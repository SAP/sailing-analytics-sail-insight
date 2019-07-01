import { reducer as networkReducer } from 'react-native-offline'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { RootState } from './config'

import AuthReducer from './AuthReducer'
import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
import EventReducer from './EventReducer'
import LocationTrackingReducer from './LocationTrackingReducer'
import OnboardingReducer from './OnboardingReducer'
import SettingsReducer from './SettingsReducer'
import UserReducer from './UserReducer'


const reducer: RootState = {
  auth: AuthReducer,
  user: UserReducer,
  entities: EntityReducer,
  checkIn: CheckInReducer,
  form: formReducer,
  locationTracking: LocationTrackingReducer,
  onboarding: OnboardingReducer,
  settings: SettingsReducer,
  network: networkReducer,
  events: EventReducer,
}

const reducers = combineReducers(reducer)

export default reducers
