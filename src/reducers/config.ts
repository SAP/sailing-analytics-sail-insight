import {
  CourseStateMap,
  SelectedCourseState,
} from 'models/Course'


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
  events?: any | EventState
  courses?: any | CourseReducerState
  markInventory?: any,
  permissions?: any,
  communications?: any | CommunicationsReducerState,
  appState?: any | AppReducerState,
  uiState?: any | UIReducerState
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
}

export interface CompetitorGap {
  gap: number
  gaining: boolean | undefined
}

export type CompetitorGapMap = Map<string, CompetitorGap>

export interface LeaderboardTrackingState {
  competitorGaps: CompetitorGapMap
  latestTrackedRace: any
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
  communicationEnabled: boolean,
  leaderboardEnabled: boolean,
  proxyUrl: string,
  masterUdpIP: string,
  masterUdpPort: object,
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

export interface EventState {
  all: Map<string, any>
  activeFilters: string[]
  isCreatingEvent: boolean
  isSelectingEvent: boolean
  isStartingTracking: boolean
  isLoadingEventList: boolean
  isPollingEvent: boolean
}

export interface CheckInState {
  active: any
  isLoadingCheckIn: boolean
  isLoadingSplash: boolean
  isDeletingMarkBinding: boolean
}

export interface CourseReducerState {
  courses: CourseStateMap // Should be Map<RaceID, Course>
  courseLoading: boolean
  selectedCourse?: SelectedCourseState
  // ID of the waypoint that is selected for editing
  selectedWaypoint?: string
  sameStartFinish: boolean
}

export interface CommunicationsReducerState {
  protocol: string
  ip: string
  port: string
  state: boolean
  valid: boolean
  startLine: object
  startLinePolling: boolean
  startLineCourse: object
  expeditionMessages: any[]
  expeditionMessagesLimit: number
}

export interface AppReducerState {
  active: boolean
  networkAvailable: boolean
}

export interface UIReducerState {
  showEditResultsDisclaimer: boolean
  showCopyResultsDisclaimer: boolean
}
