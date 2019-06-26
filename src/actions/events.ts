import { createAction } from 'redux-actions'

import { Session } from 'models'

import { DispatchType } from 'helpers/types'

export const updateEvent = createAction('UPDATE_EVENT')

export const archiveEvent = (session: Session, archived: boolean) => (
  dispatch: DispatchType,
) => {
  const eventId = session.event && session.event.id
  if (!eventId) {
    return
  }

  const updatedEvent = {
    [eventId]: {
      archived
    }
  }

  dispatch(updateEvent(updatedEvent))
}
