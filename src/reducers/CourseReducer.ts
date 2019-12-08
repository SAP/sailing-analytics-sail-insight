import { merge, defaultTo, prop, compose, insert, reject, propEq, head } from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

import { removeUserData } from 'actions/auth'
import {
  loadCourse,
  editCourse,
  selectCourse,
  updateCourseLoading,
  selectWaypoint,
  addWaypoint,
  removeWaypoint,
  selectMarkConfiguration
} from 'actions/courses'

const waypoints = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('waypoints'))(
    action.payload),
  [addWaypoint as any]: (state: any, action: any) => insert(action.payload.index, { id: action.payload.id }, state),
  [removeWaypoint as any]: (state: any, action: any) => reject(propEq('id', action.payload.id), state)
}, [])

const markConfigurations = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('markConfigurations'))(
    action.payload)
}, [])

const editedCourse = combineReducers({
  waypoints,
  markConfigurations
})

const all = handleActions({
  [loadCourse as any]: (state: any = {}, action: any) =>
    merge(state, { [action.payload.raceId]: action.payload.course })
}, {})

const selectedCourse = handleActions({
  [selectCourse as any]: (state: any, action: any) => action.payload
}, null)

const courseLoading = handleActions({
  [updateCourseLoading as any]: (state: any = {}, action: any) => action.payload
}, false)

const selectedWaypoint = handleActions({
  [selectWaypoint as any]: (state: any = {}, action: any) => action.payload,
  [addWaypoint as any]: (state: any, action: any) => action.payload.id,
  [editCourse as any]: (state: any = [], action: any) => compose(
    prop('id'),
    head,
    prop('waypoints'))(
    action.payload),
}, null)

const selectedMarkConfiguration = handleActions({
  [selectMarkConfiguration as any]: (state: any, action: any) => action.payload
}, null)

export default combineReducers({
  all,
  courseLoading,
  selectedCourse,
  editedCourse,
  selectedWaypoint,
  selectedMarkConfiguration
})
