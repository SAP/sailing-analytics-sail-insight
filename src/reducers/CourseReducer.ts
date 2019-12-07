import { merge, defaultTo, prop, compose } from 'ramda'
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

const waypoints = handleActions({
  [loadCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('waypoints'))(
    action.payload.course)
}, [])

const markConfigurations = handleActions({
  [loadCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('markConfigurations'))(
    action.payload.course)
}, [])

const course = combineReducers({
  waypoints,
  markConfigurations
})

const all = handleActions({
  [loadCourse as any]: (state: any = {}, action: any) =>
    merge(state, {
      [action.payload.raceId]: action.payload.course && course(undefined, action)
    })
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
