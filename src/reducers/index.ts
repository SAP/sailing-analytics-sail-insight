import { reducer as networkReducer } from 'react-native-offline'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { RootState } from './config'

import AuthReducer from './AuthReducer'
import CheckInReducer from './CheckInReducer'
import CourseReducer from './CourseReducer'
import EntityReducer from './EntityReducer'
import EventReducer from './EventReducer'
import LeaderboardTrackingReducer from './LeaderboardTrackingReducer'
import LocationTrackingReducer from './LocationTrackingReducer'
import OnboardingReducer from './OnboardingReducer'
import permissions from './permissionsReducer'
import SettingsReducer from './SettingsReducer'
import UserReducer from './UserReducer'
import CommunicationsReducer from './CommunicationsReducer'
import AppStateReducer from './AppStateReducer'
import UIStateReducer from './UIStateReducer'

const reducer: RootState = {
  auth: AuthReducer,
  user: UserReducer,
  entities: EntityReducer,
  checkIn: CheckInReducer,
  form: formReducer,
  locationTracking: LocationTrackingReducer,
  leaderboardTracking: LeaderboardTrackingReducer,
  onboarding: OnboardingReducer,
  settings: SettingsReducer,
  network: networkReducer,
  courses: CourseReducer,
  events: EventReducer,
  permissions,
  communications: CommunicationsReducer,
  appState: AppStateReducer,
  uiState: UIStateReducer,
}

const reducers = combineReducers(reducer)

export default reducers
