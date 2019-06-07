import { TrackingSession } from 'models'
import { validateRequired, validateSessionname } from './validators'


export const SESSION_FORM_NAME = 'session'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_TRACK_NAME = 'trackName'
export const FORM_KEY_BOAT_NAME = 'boatName'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_SAIL_NUMBER = 'sailNumber'
export const FORM_KEY_BOAT_ID = 'boatId'
export const FORM_KEY_TEAM_NAME = 'teamName'
export const FORM_KEY_TEAM_IMAGE = 'teamImage'
export const FORM_KEY_NATIONALITY = 'nationality'
export const FORM_KEY_PRIVACY_SETTING = 'privacySetting'

export const trackingSessionFromFormValues = (values: any) => values && ({
  boatClass: values[FORM_KEY_BOAT_CLASS],
  name: values[FORM_KEY_NAME],
  boatName: values[FORM_KEY_BOAT_NAME],
  boatId: values[FORM_KEY_BOAT_ID],
  privacySetting: values[FORM_KEY_PRIVACY_SETTING],
  sailNumber: values[FORM_KEY_SAIL_NUMBER],
  nationality: values[FORM_KEY_NATIONALITY],
  teamName: values[FORM_KEY_TEAM_NAME],
  teamImage: values[FORM_KEY_TEAM_IMAGE],
  trackName: values[FORM_KEY_TRACK_NAME],
} as TrackingSession)

export const formValuesFromTrackingSession = (session: TrackingSession) => session && ({
  [FORM_KEY_NAME]: session.name,
  [FORM_KEY_TRACK_NAME]: session.trackName,
  [FORM_KEY_BOAT_CLASS]: session.boatClass,
  [FORM_KEY_SAIL_NUMBER]: session.sailNumber,
  [FORM_KEY_PRIVACY_SETTING]: session.privacySetting,
  [FORM_KEY_NATIONALITY]: session.nationality,
  [FORM_KEY_TEAM_NAME]: session.teamName,
  [FORM_KEY_TEAM_IMAGE]: session.teamImage,
  [FORM_KEY_BOAT_NAME]: session.boatName,
  [FORM_KEY_BOAT_ID]: session.boatId || null,
})

export const validate = (values: any = {}) => {
  const errors: any = {}

  errors[FORM_KEY_NAME] = validateRequired(values[FORM_KEY_NAME]) || validateSessionname(values[FORM_KEY_NAME])
  errors[FORM_KEY_TRACK_NAME] = validateRequired(values[FORM_KEY_TRACK_NAME])
  errors[FORM_KEY_BOAT_CLASS] = validateRequired(values[FORM_KEY_BOAT_CLASS])
  errors[FORM_KEY_SAIL_NUMBER] = validateRequired(values[FORM_KEY_SAIL_NUMBER])
  errors[FORM_KEY_PRIVACY_SETTING] = validateRequired(values[FORM_KEY_PRIVACY_SETTING])
  errors[FORM_KEY_NATIONALITY] = validateRequired(values[FORM_KEY_NATIONALITY])
  errors[FORM_KEY_TEAM_NAME] = validateRequired(values[FORM_KEY_TEAM_NAME])
  errors[FORM_KEY_BOAT_NAME] = validateRequired(values[FORM_KEY_BOAT_NAME])

  return errors
}
