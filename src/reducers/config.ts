export const CHECK_IN_REDUCER_NAME = 'checkIn'
export const ENTITIES_REDUCER_NAME = 'entities'
export const LOCATION_TRACKING_REDUCER_NAME = 'locationTracking'
export const NETWORK_REDUCER_NAME = 'network'
export const FORM_REDUCER_NAME = 'form'
export const ONBOARDING_REDUCER_NAME = 'onboarding'
export const SETTINGS_REDUCER_NAME = 'settings'
export const AUTH_REDUCER_NAME = 'auth'
export const USER_REDUCER_NAME = 'user'


export const LocationTrackingReducerKeys = {
  STATUS_KEY: 'status',
  LEADERBOARD_NAME_KEY: 'leaderboardName',
  EVENT_ID_KEY: 'eventId',
  UNSENT_GPS_FIXES_KEY: 'unsentGpsFixCount',
  LOCATION_ACCURACY_KEY: 'locationAccuracy',
  SPEED_IN_KNOTS_KEY: 'speedInKnots',
  START_AT_KEY: 'startedAt',
  HEADING_IN_DEG_KEY: 'headingInDeg',
  DISTANCE_KEY: 'distance',
  LAST_LATITUDE_KEY: 'lastLatitude',
  LAST_LONGITUDE_KEY: 'lastLongitude',
  LAST_WIND_DIRECTION: 'lastWindCourse',
  LAST_WIND_SPEED_IN_KNOTS: 'lastWindSpeedInKnots',
  WAS_TRACKING_START_TIME_UPDATED: 'wasTrackingStartTimeUpdated',
}

export const OnboardingReducerKeys = {
  JOIN_DISMISSED_AT_KEY: 'joinRegattaDismissedAt',
  ACCOUNT_DISMISSED_AT_KEY: 'createAccountDismissedAt',
}

export const SettingsReducerKeys = {
  BULK_GPS_UPDATE: 'bulkGpsUpdate',
}

export const AuthReducerKeys = {
  TOKEN: 'accessToken',
  USER: 'user',
}

export const UserReducerKeys = {
  CURRENT_BOAT: 'currentBoat',
  BOATS: 'boats',
}
