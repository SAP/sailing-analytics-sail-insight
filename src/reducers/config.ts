import { AutoCourseUpdateState } from 'helpers/types'
import { CourseState, Mark, MarkID, SelectedCourseState } from 'models/Course'


export interface RootState {
  auth?: any | AuthState
  network?: any
  checkIn?: any | CheckInState
  entities?: any
  leaderboardTracking?: any | LeaderboardTrackingState
  locationTracking?: any | LocationTrackingState
  form?: any
  onboarding?: any | OnboardingState
  settings?: any | SettingsState
  user?: any | UserState
  races?: any | RaceState
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

export interface CompetitorGap {
  gap: number
  gaining: boolean | undefined
}

export type CompetitorGapMap = Map<string, CompetitorGap>

export interface LeaderboardTrackingState {
  competitorGaps: CompetitorGapMap
}

export interface OnboardingState {
  joinRegattaDismissedAt: number | null
  createAccountDismissedAt: number | null
}

export interface SettingsState {
  bulkGpsUpdate: boolean,
  enableAnalytics: boolean,
  serverUrl: string,
  verboseLogging: boolean,
  leaderboardEnabled: boolean,
}

export interface AuthState {
  accessToken: string | null
  user: string | null
}

export interface UserState {
  currentBoat?: any | null
  boats?: any | null
  images?: any
}

export interface CheckInState {
  active: any
  isLoadingCheckIn: boolean
}

export interface RaceState {
  // RaceID and MarkID - strings
  allRaces: any // Should be Map<RaceID, Race>
  courses: Map<string, CourseState> // Should be Map<RaceID, Course>
  marks: Map<MarkID, Mark> // Should be Map<MarkID, Mark>
  courseLoading: boolean
  selectedCourse?: SelectedCourseState
  // ID of the waypoint that is selected for editing
  selectedWaypoint?: string
  sameStartFinish: boolean
}
