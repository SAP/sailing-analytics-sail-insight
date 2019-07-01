import { createAction } from 'redux-actions'

import { Session } from 'models'

import { fetchAction } from 'helpers/actions'
import { DispatchType } from 'helpers/types'

export const updateEvent = createAction('UPDATE_EVENT')
export const receiveEvent = createAction('RECEIVE_EVENT')
export const updateEventFilters = createAction('UPDATE_EVENT_FILTERS')

export const fetchEvent = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: DispatchType) => {
    return await dispatch(fetchAction(requestFunction, receiveEvent)(...args))
  }

export const archiveEvent = (session: Session, archived: boolean) => (
  dispatch: DispatchType,
) => {
  const eventId = session.event && session.event.id
  if (!eventId) {
    return
  }

  const payload = {
    id: eventId,
    data: {
      archived
    },
  }

  dispatch(updateEvent(payload))
}
