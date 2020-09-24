import { isNil } from 'ramda'
import moment from 'moment'

import EventCreationData, {
  RegattaType,
} from 'models/EventCreationData'
import { generateNewSessionName } from 'services/SessionService'
import { validateRequiredWithErrorCode } from './validators'
import I18n from 'i18n'

export const EVENT_CREATION_FORM_NAME = 'eventCreation'
export const EVENT_EDIT_FORM_NAME = 'eventEdit'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_DATE_FROM = 'dateFrom'
export const FORM_KEY_DATE_TO = 'dateTo'
export const FORM_KEY_LOCATION = 'location'

export const FORM_KEY_REGATTA_TYPE = 'regattaType'
export const FORM_KEY_BOAT_CLASS = 'boatClass'

export const FORM_KEY_NUMBER_OF_RACES = 'numberOfRaces'
export const FORM_KEY_DISCARDS = 'discards'

export const generateInitialValues = () => ({
  [FORM_KEY_DATE_FROM]: moment().startOf('day'),
  [FORM_KEY_DATE_TO]: moment().endOf('day'),
  [FORM_KEY_NUMBER_OF_RACES]: 3,
  [FORM_KEY_DISCARDS]: [],
  [FORM_KEY_REGATTA_TYPE]: RegattaType.OneDesign,
  [FORM_KEY_BOAT_CLASS]: null
})

export const generateDefaultValues = () => ({
  [FORM_KEY_NAME]: generateNewSessionName(),
})

export const eventCreationDataFromFormValues = (values: any) => values && ({
  name: values[FORM_KEY_NAME],
  dateFrom: values[FORM_KEY_DATE_FROM],
  dateTo: values[FORM_KEY_DATE_TO],
  location: values[FORM_KEY_LOCATION],
  regattaType: values[FORM_KEY_REGATTA_TYPE],
  boatClass: values[FORM_KEY_BOAT_CLASS],
  numberOfRaces: values[FORM_KEY_NUMBER_OF_RACES],
  discards: values[FORM_KEY_DISCARDS],
} as EventCreationData)

const validateNoUndefined = (arr: any[]) =>
  arr.some(isNil) ? 'Discard races must not be undefined' : undefined

const validateAscendingOrder = (arr: number[]) =>
  arr.every((item: number, ind: number) => ind === 0 || item > arr[ind - 1])
    ? undefined
    : 'Discard values must be in ascending order'

export const validate = (values: any = {}, props: any = {}) => ({
  [FORM_KEY_NAME]: validateRequiredWithErrorCode('error_no_name')(props.defaultValues && props.defaultValues[FORM_KEY_NAME]) && validateRequiredWithErrorCode('error_no_name')(values[FORM_KEY_NAME]),
  [FORM_KEY_LOCATION]: validateRequiredWithErrorCode('error_no_venue')(values[FORM_KEY_LOCATION]),
  [FORM_KEY_BOAT_CLASS]: values[FORM_KEY_REGATTA_TYPE] === RegattaType.OneDesign ?
    validateRequiredWithErrorCode('error_no_boat_class')(values[FORM_KEY_BOAT_CLASS]) :
    undefined,
  [FORM_KEY_DATE_FROM]: values[FORM_KEY_DATE_FROM] && values[FORM_KEY_DATE_TO] &&
    values[FORM_KEY_DATE_FROM].isAfter(values[FORM_KEY_DATE_TO]) ?
    I18n.t('error_start_date_after_end_date') :
    undefined
  // [FORM_KEY_DISCARDS]:
  //   validateNoUndefined(values[FORM_KEY_DISCARDS]) ||
  //   validateAscendingOrder(values[FORM_KEY_DISCARDS]),
})
