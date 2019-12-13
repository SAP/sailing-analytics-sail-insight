import { merge, defaultTo, prop, compose, insert, reject,
  propEq, head, map, when, mergeLeft, mergeDeepLeft, always,
  append, concat, pick, dissoc, evolve, equals, isNil, find } from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { PassingInstruction } from 'models/Course'

import { removeUserData } from 'actions/auth'

import {
  loadCourse,
  editCourse,
  selectCourse,
  updateCourseLoading,
  selectWaypoint,
  addWaypoint,
  removeWaypoint,
  selectMarkConfiguration,
  updateWaypointName,
  updateWaypointShortName,
  updateMarkConfigurationName,
  updateWaypointPassingInstruction,
  updateMarkConfigurationShortName,
  updateMarkConfigurationLocation,
  changeWaypointToNewMark,
  changeWaypointToNewLine,
  changeWaypointMarkConfigurationToNew,
  assignMarkPropertiesToMarkConfiguration,
  replaceWaypointMarkConfiguration
} from 'actions/courses'

const waypoints = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('waypoints'))(
    action.payload),
  [addWaypoint as any]: (state: any, action: any) => insert(action.payload.index, { id: action.payload.id }, state),
  [removeWaypoint as any]: (state: any, action: any) => reject(propEq('id', action.payload.id), state),
  [updateWaypointName as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), mergeLeft({ controlPointName: action.payload.value })),
    state),
  [updateWaypointShortName as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), mergeLeft({ controlPointShortName: action.payload.value })),
    state),
  [updateWaypointPassingInstruction as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), mergeLeft({ passingInstruction: action.payload.value })),
    state),
  [changeWaypointToNewMark as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id),
      always({
        id: action.payload.id,
        passingInstruction: PassingInstruction.Port,
        markConfigurationIds: action.payload.markConfigurationIds
      })), state), 
  [changeWaypointToNewLine as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id),
      always({
        id: action.payload.id,
        controlPointName: 'New Line',
        controlPointShortName: 'NL',
        passingInstruction: PassingInstruction.Line,
        markConfigurationIds: action.payload.markConfigurationIds
      })), state),
  [replaceWaypointMarkConfiguration as any]: (state: any, action: any) => map(
    when(
      propEq('id', action.payload.id),
      evolve({ markConfigurationIds: map(when(equals(action.payload.oldId), always(action.payload.newId))) })),
      state),
  [changeWaypointMarkConfigurationToNew as any]: (state: any, action: any) => map(
    when(
      propEq('id', action.payload.id),
      evolve({ markConfigurationIds: map(when(equals(action.payload.oldId), always(action.payload.newId))) })),
      state),
}, [])

const markConfigurations = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('markConfigurations'))(
    action.payload),
  [updateMarkConfigurationName as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), mergeDeepLeft({ effectiveProperties: { name: action.payload.value } })),
    state),
  [updateMarkConfigurationShortName as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), mergeDeepLeft({ effectiveProperties: { shortName: action.payload.value } })),
    state),
  [updateMarkConfigurationLocation as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id),
      mergeDeepLeft({ effectivePositioning: { position: {
        latitude_deg: action.payload.value.latitude,
        longitude_deg: action.payload.value.longitude }}})),
    state),
  [assignMarkPropertiesToMarkConfiguration as any]: (state: any, action: any) => map(
    when(propEq('id', action.payload.id), compose(
      mergeDeepLeft({
        markPropertiesId: action.payload.markProperties.id,
        effectiveProperties: pick(['name', 'shortName', 'color', 'shape', 'pattern', 'markType'], action.payload.markProperties),
        effectivePositioning: action.payload.markProperties.latDeg &&
          ({ position: { latitude_deg: action.payload.markProperties.latDeg,
                         longitude_deg: action.payload.markProperties.lonDeg }})
      }),
      dissoc('effectiveProperties'),
      dissoc('effectivePositioning'),
      dissoc('markId'))),
    state),
  [changeWaypointToNewMark as any]: (state: any, action: any) =>
    when(
      compose(isNil, find(propEq('id', action.payload.markConfigurationIds[0]))),
      append({
      id: action.payload.markConfigurationIds[0],
      effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
      }), state),
  [changeWaypointToNewLine as any]: (state: any, action: any) => concat([
    {
      id: action.payload.markConfigurationIds[0],
      effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
    }, {
      id: action.payload.markConfigurationIds[1],
      effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
  }], state),
  [changeWaypointMarkConfigurationToNew as any]: (state: any, action: any) => append({
    id: action.payload.newId,
    effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
  }, state)
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
    action.payload)
}, null)

const selectedMarkConfiguration = handleActions({
  [selectMarkConfiguration as any]: (state: any, action: any) => action.payload,
  [changeWaypointToNewMark as any]: (state: any, action: any) => action.payload.markConfigurationIds[0],
  [changeWaypointToNewLine as any]: (state: any, action: any) => action.payload.markConfigurationIds[0],
  [replaceWaypointMarkConfiguration as any]: (state: any, action: any) => action.payload.newId
}, null)

export default combineReducers({
  all,
  courseLoading,
  selectedCourse,
  editedCourse,
  selectedWaypoint,
  selectedMarkConfiguration
})
