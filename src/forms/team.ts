import { TeamTemplate } from 'models'


export const TEAM_FORM_NAME = 'team'

export const FORM_KEY_TEAM_NAME = 'name'
export const FORM_KEY_NATIONALITY = 'nationality'
export const FORM_KEY_BOAT_NAME = 'boatName'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_SAIL_NUMBER = 'sailNumber'
export const FORM_KEY_IMAGE = 'image'

export const teamFromFormValues = (values: any) => values && ({
  name: values[FORM_KEY_TEAM_NAME],
  nationality: values[FORM_KEY_NATIONALITY],
  imageData: values[FORM_KEY_IMAGE] || undefined,
  boatClass: values[FORM_KEY_BOAT_CLASS],
  boatName: values[FORM_KEY_BOAT_NAME],
  sailNumber: values[FORM_KEY_SAIL_NUMBER],
} as TeamTemplate)
