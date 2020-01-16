import { compose, find, identity, prop, propEq } from 'ramda'
import { createSelector } from 'reselect'
import { getSelectedEventInfo } from './event'

export const getPermissions = (state: any) => state.permissions

export const canUpdateEvent = (eventId: string) => createSelector(
  getPermissions,
  compose(
    prop('granted'),
    find(propEq('permission', `EVENT:UPDATE:${eventId}`))))

export const canUpdateCurrentEvent = createSelector(
  getSelectedEventInfo,
  identity,
  (selectedEventInfo, state) =>
    selectedEventInfo && canUpdateEvent(selectedEventInfo.eventId)(state))