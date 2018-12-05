import { AutoCourseUpdateState } from 'helpers/types'

export interface RootState {
  auth?: any | AuthState
  network?: any
  checkIn?: any
  entities?: any
  locationTracking?: any | LocationTrackingState
  form?: any
  onboarding?: any | OnboardingState
  settings?: any | SettingsState
  user?: any | UserState
}


export interface LocationTrackingState {
  status: string | null
  leaderboardName: string | null
  eventId: string | null
  unsentGpsFixCount: number | null
  locationAccuracy: number | null
  speedInKnots: number | null
  startedAt: string | null
  headingInDeg: number | null
  distance: number | null
  lastLatitude: number | null
  lastLongitude: number | null
  lastWindCourse: number | null
  lastWindSpeedInKnots: number | null
  wasTrackingStartTimeUpdated: boolean
  validGpsFixCount: number
  startAutoCourseUpdateStatus: AutoCourseUpdateState
}

export interface OnboardingState {
  joinRegattaDismissedAt: number | null
  createAccountDismissedAt: number | null
}

export interface SettingsState {
  bulkGpsUpdate: boolean
}

export interface AuthState {
  accessToken: string | null
  user: string | null
}

export interface UserState {
  currentBoat?: any | null
  boats?: any | null
}
