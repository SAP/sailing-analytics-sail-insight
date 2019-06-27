import { EventFilter } from 'models/EventFilter'
import { getEventFilters } from 'selectors/UI'

export const EVENT_FILTER_FORM_NAME = 'eventFilter'

export const FORM_KEY_ALL = 'all'
export const FORM_KEY_ARCHIVED = 'archived'
export const FORM_KEY_OWN = 'own'
export const FORM_KEY_INVITED = 'invited'

export const eventFilterFromFormValues = (values: any) => ([
  ...(values[FORM_KEY_ALL]      ? [EventFilter.All]      : []),
  ...(values[FORM_KEY_ARCHIVED] ? [EventFilter.Archived] : []),
  ...(values[FORM_KEY_OWN]      ? [EventFilter.Own]      : []),
  ...(values[FORM_KEY_INVITED]  ? [EventFilter.Invited]  : []),
])

export const getFormInitialValues = (state: any) => {
  const eventFilters = getEventFilters(state)

  return {
    [FORM_KEY_ALL]:      eventFilters.includes(EventFilter.All),
    [FORM_KEY_ARCHIVED]: eventFilters.includes(EventFilter.Archived),
    [FORM_KEY_OWN]:      eventFilters.includes(EventFilter.Own),
    [FORM_KEY_INVITED]:  eventFilters.includes(EventFilter.Invited),
  }
}
