import { merge } from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

import { removeUserData } from 'actions/auth'
import {
  loadCourse,
  selectCourse,
  updateCourseLoading,
  selectWaypoint,
  selectMarkConfiguration
} from 'actions/courses'

const all = handleActions({
  [loadCourse as any]: (state: any = {}, action: any) =>
    merge(state, action.payload || {})
}, {})

const selectedCourse = handleActions({
  [selectCourse as any]: (state, action) => action.payload
}, null)

const courseLoading = handleActions({
  [updateCourseLoading as any]: (state: any = {}, action: any) => action.payload
}, false)

const selectedWaypoint = handleActions({
  [selectWaypoint as any]: (state: any = {}, action: any) => action.payload
}, null)

const selectedMarkConfiguration = handleActions({
  [selectMarkConfiguration as any]: (state, action) => action.payload
}, null)

export default combineReducers({
  all,
  courseLoading,
  selectedCourse,
  selectedWaypoint,
  selectedMarkConfiguration
})