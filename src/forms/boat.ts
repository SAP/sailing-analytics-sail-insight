import { BoatTemplate } from 'models'


export const BOAT_FORM_NAME = 'boat'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_SAIL_NUMBER = 'sailNumber'
export const FORM_KEY_IMAGE = 'image'

export const boatFromFormValues = (values: any) => values && ({
  imageUrl: undefined,
  boatClass: values[FORM_KEY_BOAT_CLASS],
  name: values[FORM_KEY_NAME],
  sailNumber: values[FORM_KEY_SAIL_NUMBER],
} as BoatTemplate)
