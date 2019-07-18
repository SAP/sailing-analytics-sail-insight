export const EVENT_CREATION_FORM_NAME = 'eventCreation'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_DATE_FROM = 'dateFrom'
export const FORM_KEY_DATE_TO = 'dateTo'
export const FORM_KEY_LOCATION = 'location'

export const FORM_KEY_REGATTA_TYPE = 'regattaType'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_RATING_SYSTEM = 'ratingSystem'

export const FORM_KEY_NUMBER_OF_RACES = 'numberOfRaces'
export const FORM_KEY_DISCARDS_START = 'discardsStart'


export const eventWizardCommonFormSettings = {
  form: EVENT_CREATION_FORM_NAME,
  destroyOnUnmount: false,        // <-- preserve form data across different steps
  forceUnregisterOnUnmount: true,
}

export const initialValues = {
  [FORM_KEY_NUMBER_OF_RACES]: 3,
  [FORM_KEY_DISCARDS_START]: 3,
  [FORM_KEY_REGATTA_TYPE]: 'oneDesign',
}
