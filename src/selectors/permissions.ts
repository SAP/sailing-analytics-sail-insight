import { compose, find, propEq, prop } from 'ramda'
import { createSelector } from 'reselect'

export const getPermissions = (state: any) => state.permissions

export const canUpdateEvent = (eventId: string) => createSelector(
  getPermissions,
  compose(
    prop('granted'),
    find(propEq('permission', `EVENT:UPDATE:${eventId}`))))