import EventCreationData, {
  HandicapRatingSystem,
  RegattaType,
} from 'models/EventCreationData'
import { generateNewSessionName } from 'services/SessionService'
import { validateRequired } from './validators'

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

const datePickerDateFormat = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

export const initialValues = {
  [FORM_KEY_NAME]: generateNewSessionName(),
  [FORM_KEY_DATE_FROM]: datePickerDateFormat(new Date()),
  [FORM_KEY_DATE_TO]: datePickerDateFormat(new Date()),
  [FORM_KEY_NUMBER_OF_RACES]: 3,
  [FORM_KEY_DISCARDS_START]: 3,
  [FORM_KEY_REGATTA_TYPE]: RegattaType.OneDesign,
  [FORM_KEY_RATING_SYSTEM]: HandicapRatingSystem.TimeOnTimeAndDistance,
}

export const eventCreationDataFromFormValues = (values: any) => values && ({
  name: values[FORM_KEY_NAME],
  dateFrom: values[FORM_KEY_DATE_FROM],
  dateTo: values[FORM_KEY_DATE_TO],
  location: values[FORM_KEY_LOCATION],
  regattaType: values[FORM_KEY_REGATTA_TYPE],
  boatClass: values[FORM_KEY_BOAT_CLASS],
  ratingSystem: values[FORM_KEY_RATING_SYSTEM],
  numberOfRaces: values[FORM_KEY_NUMBER_OF_RACES],
  discardsStart: values[FORM_KEY_DISCARDS_START],
} as EventCreationData)

export const validateBasics = (values: any = {}) => ({
  [FORM_KEY_NAME]: validateRequired(values[FORM_KEY_NAME]),
  [FORM_KEY_LOCATION]: validateRequired(values[FORM_KEY_LOCATION]),
})

export const validateTypeAndBoatClass   = (values: any = {}) => ({
  [FORM_KEY_BOAT_CLASS]: validateRequired(values[FORM_KEY_BOAT_CLASS]),
})
