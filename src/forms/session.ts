import { TrackingSession } from 'models'

export const SESSION_FORM_NAME = 'session'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_TRACK_NAME = 'trackName'
export const FORM_KEY_BOAT_NAME = 'boatName'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_SAIL_NUMBER = 'sailNumber'
export const FORM_KEY_TEAM_NAME = 'teamName'
export const FORM_KEY_PRIVACY_SETTING = 'privacySetting'

export const trackingSessionFromFormValues = (values: any) => values && ({
  boatClass: values[FORM_KEY_BOAT_CLASS],
  name: values[FORM_KEY_NAME],
  boatName: values[FORM_KEY_BOAT_NAME],
  privacySetting: values[FORM_KEY_PRIVACY_SETTING],
  sailNumber: values[FORM_KEY_SAIL_NUMBER],
  teamName: values[FORM_KEY_TEAM_NAME],
  trackName: values[FORM_KEY_TRACK_NAME],
} as TrackingSession)

export const formValuesFromTrackingSession = (session: TrackingSession) => session && ({
  [FORM_KEY_NAME]: session.name,
  [FORM_KEY_TRACK_NAME]: session.trackName,
  [FORM_KEY_BOAT_CLASS]: session.boatClass,
  [FORM_KEY_SAIL_NUMBER]: session.sailNumber,
  [FORM_KEY_PRIVACY_SETTING]: session.privacySetting,
  [FORM_KEY_TEAM_NAME]: session.teamName,
  [FORM_KEY_BOAT_NAME]: session.boatName,
})
