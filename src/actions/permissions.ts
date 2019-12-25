import { createAction } from 'redux-actions'

export const FETCH_PERMISSIONS_FOR_EVENT = 'FETCH_PERMISSIONS_FOR_EVENT'

export const fetchPermissionsForEvent = createAction(FETCH_PERMISSIONS_FOR_EVENT)
export const updatePermissions = createAction('UPDATE_PERMISSIONS')
