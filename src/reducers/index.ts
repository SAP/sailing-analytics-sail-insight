import { reducer as networkReducer } from 'react-native-offline'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { RootState } from './config'

import AuthReducer from './AuthReducer'
import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'
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
}

const reducers = combineReducers(reducer)


const rootReducer = (state: any, action: any) => {
  let newState = state
  if (action.type === 'REMOVE_USER_DATA') {
    newState = reducer
  }
  return reducers(newState, action)
}


export default rootReducer
