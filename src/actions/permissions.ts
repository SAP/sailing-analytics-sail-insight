import { createAction } from 'redux-actions'

export const FETCH_EVENT_PERMISSION = 'FETCH_EVENT_PERMISSION'
export const UPDATE_EVENT_PERMISSION = 'UPDATE_EVENT_PERMISSION'

export const fetchPermissionsForEvent = createAction(FETCH_EVENT_PERMISSION)
export const updateEventPermissions = createAction(UPDATE_EVENT_PERMISSION)
