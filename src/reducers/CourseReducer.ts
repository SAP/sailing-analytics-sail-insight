import { mergeRight, defaultTo, prop, compose, insert, reject, tap,
  propEq, head, map, when, mergeLeft, mergeDeepLeft, always, ifElse,
  append, concat, pick, dissoc, evolve, equals, isNil, find, has,
  apply, applySpec, take, move, last, includes, __, path } from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { PassingInstruction } from 'models/Course'
import I18n from 'i18n'
import { getHashedDeviceId } from 'selectors/user'
import { toHashedString } from 'helpers/utils'

import {
  loadCourse,
  editCourse,
  selectCourse,
  updateCourseLoading,
  selectWaypoint,
  addWaypoint,
  removeWaypoint,
  selectMarkConfiguration,
  updateWaypoint,
  updateWaypointName,
  updateWaypointShortName,
  updateMarkConfigurationName,
  updateWaypointPassingInstruction,
  updateMarkConfigurationShortName,
  updateMarkConfigurationLocation,
  updateMarkConfigurationWithCurrentDeviceAsTracker,
  changeWaypointToNewMark,
  changeWaypointToNewLine,
  changeWaypointMarkConfigurationToNew,
  changeMarkConfigurationDeviceTracking,
  assignMarkOrMarkPropertiesToMarkConfiguration,
  replaceWaypointMarkConfiguration
} from 'actions/courses'
import { removeUserData } from 'actions/auth'

const updateWaypointMarkConfiguration = (state: any, action: any) => {
  if (!state || state.length === 0) {
    return state
  }

  const sameStartFinish = compose(
    apply(equals),
    map(prop('markConfigurationIds')),
    take(2),
    move(-1, 0))(
    state)

  const firstWaypoint = head(state)
  const lastWaypoint = last(state)
  const startFinishIds = [firstWaypoint?.id, lastWaypoint?.id].filter(Boolean)
  const isStartOrFinish = includes(action.payload.id, startFinishIds)
  const idsToUpdate = isStartOrFinish && sameStartFinish ? startFinishIds : [action.payload.id]

  return map(
    when(
      compose(
        includes(__, idsToUpdate),
        prop('id')),
      evolve({ markConfigurationIds: map(when(equals(action.payload.oldId), always(action.payload.newId))) })),
    state)
}

const waypoints = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('waypoints'))(
    action.payload),
  [addWaypoint as any]: (state: any, action: any) => insert(action.payload.index, { id: action.payload.id }, state),
  [removeWaypoint as any]: (state: any, action: any) => reject(propEq(action.payload.id, 'id'), state),
  [updateWaypoint as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeLeft(action.payload.waypoint)),
    state),
  [updateWaypointName as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeLeft({ controlPointName: action.payload.value })),
    state),
  [updateWaypointShortName as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeLeft({ controlPointShortName: action.payload.value })),
    state),
  [updateWaypointPassingInstruction as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeLeft({ passingInstruction: action.payload.value })),
    state),
  [changeWaypointToNewMark as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'),
      always({
        id: action.payload.id,
        passingInstruction: action.payload.passingInstruction || PassingInstruction.Port,
        markConfigurationIds: action.payload.markConfigurationIds
      })), state),
  [changeWaypointToNewLine as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'),
      always({
        id: action.payload.id,
        controlPointName: defaultTo(action.payload.passingInstruction === PassingInstruction.Line ?
          I18n.t('placeholder_course_creation_new_line') : I18n.t('placeholder_course_creation_new_gate'), action.payload.controlPointName),
        controlPointShortName: defaultTo(action.payload.passingInstruction === PassingInstruction.Line ?
          I18n.t('placeholder_course_creation_new_line_short') : I18n.t('placeholder_course_creation_new_gate_short'), action.payload.controlPointShortName),
        passingInstruction: action.payload.passingInstruction,
        markConfigurationIds: action.payload.markConfigurationIds
      })), state),
  [replaceWaypointMarkConfiguration as any]: updateWaypointMarkConfiguration,
  [changeWaypointMarkConfigurationToNew as any]: updateWaypointMarkConfiguration,
  [removeUserData as any]: always([])
}, [])

const markConfigurations = handleActions({
  [editCourse as any]: (state: any = [], action: any) => compose(
    defaultTo([]),
    prop('markConfigurations'))(
    action.payload),
  [updateMarkConfigurationName as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeDeepLeft({ effectiveProperties: { name: action.payload.value } })),
    state),
  [updateMarkConfigurationShortName as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), mergeDeepLeft({ effectiveProperties: { shortName: action.payload.value } })),
    state),
  [updateMarkConfigurationLocation as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), compose(
      dissoc('currentTrackingDeviceId'),
      mergeLeft({
        lastKnownPosition: {
          latitude_deg: action.payload.value.latitude,
          longitude_deg: action.payload.value.longitude } }))),
    state),
  [updateMarkConfigurationWithCurrentDeviceAsTracker as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), compose(
      dissoc('lastKnownPosition'),
      mergeLeft({
        trackingDevices: [{
          trackingDeviceType: 'smartphoneUUID',
          trackingDeviceHash: getHashedDeviceId(),
          trackingDeviceMappedFromMillis: new Date().getTime()
        }],
        currentTrackingDeviceId: {
          id: action.payload.deviceId,
          type: 'smartphoneUUID',
          stringRepresentation: action.payload.deviceId }}))),
    state),
  [changeMarkConfigurationDeviceTracking as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), compose(
      mergeLeft({
        currentTrackingDeviceId: action.payload.currentTrackingDeviceId,
        trackingDevices: map(applySpec({
          trackingDeviceType: path(['deviceId', 'type']),
          trackingDeviceHash: compose(toHashedString, path(['deviceId', 'id'])),
          trackingDeviceMappedFromMillis: prop('mappedFrom'),
          trackingDeviceLastKnownPosition: prop('lastGPSFix'),
        }))(action.payload.trackingDevices)
      }))),
    state),
  [assignMarkOrMarkPropertiesToMarkConfiguration as any]: (state: any, action: any) => map(
    when(propEq(action.payload.id, 'id'), compose(
      mergeDeepLeft({
        markId: action.payload.markOrMarkProperties.markId,
        markPropertiesId: compose(
          ifElse(has('markPropertiesId'), prop('markPropertiesId'), prop('id')))(
          action.payload.markOrMarkProperties),
        effectiveProperties: compose(
          pick(['name', 'shortName', 'color', 'shape', 'pattern', 'markType']),
          when(has('effectiveProperties'), prop('effectiveProperties')))(
          action.payload.markOrMarkProperties),
        currentTrackingDeviceId: path(['positioning', 'device_identifier'], action.payload.markOrMarkProperties),
        lastKnownPosition: path(['positioning', 'position'], action.payload.markOrMarkProperties)
      }),
      dissoc('effectiveProperties'),
      dissoc('currentTrackingDeviceId'),
      dissoc('lastKnownPosition'),
      dissoc('markId'))),
    state),
  [changeWaypointToNewMark as any]: (state: any, action: any) =>
    when(
      compose(isNil, find(propEq(action.payload.markConfigurationIds[0], 'id'))),
      append({
      id: action.payload.markConfigurationIds[0],
      effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
      }), state),
  [changeWaypointToNewLine as any]: (state: any, action: any) => concat([
    {
      id: action.payload.markConfigurationIds[0],
      effectiveProperties: {
        markType: 'BUOY',
        shortName: action.payload.passingInstruction === PassingInstruction.Line ? 'LM1' : 'GM1',
        name: action.payload.passingInstruction === PassingInstruction.Line ? 'Line Mark 1' : 'Gate Mark 1'
      }
    }, {
      id: action.payload.markConfigurationIds[1],
      effectiveProperties: {
        markType: 'BUOY',
        shortName: action.payload.passingInstruction === PassingInstruction.Line ? 'LM2' : 'GM2',
        name: action.payload.passingInstruction === PassingInstruction.Line ? 'Line Mark 2' : 'Gate Mark 2'
      }
  }], state),
  [changeWaypointMarkConfigurationToNew as any]: (state: any, action: any) => append({
    id: action.payload.newId,
    effectiveProperties: { markType: 'BUOY', shortName: 'NM', name: 'New Mark' }
  }, state),
  [removeUserData as any]: always([])
}, [])

const name = handleActions({
  [editCourse as any]: (state: any = [], action: any) => defaultTo(null, action.payload.name)
}, null)

const numberOfLaps = handleActions({
  [editCourse as any]: (state: any = [], action: any) => defaultTo(null, action.payload.numberOfLaps)
}, null)

const editedCourse = combineReducers({
  name,
  numberOfLaps,
  waypoints,
  markConfigurations
})

const all = handleActions({
  [loadCourse as any]: (state: any = {}, action: any) =>
    mergeRight(state, { [action.payload.raceId]: action.payload.course }),
  [removeUserData as any]: always({})
}, {})

const selectedCourse = handleActions({
  [selectCourse as any]: (state: any, action: any) => action.payload,
  [removeUserData as any]: always(null)
}, null)

const courseLoading = handleActions({
  [updateCourseLoading as any]: (state: any = {}, action: any) => action.payload
}, false)

const selectedWaypoint = handleActions({
  [selectWaypoint as any]: (state: any = {}, action: any) => action.payload,
  [updateWaypoint as any]: (state: any, action: any) => action.payload.waypoint.id,
  [addWaypoint as any]: (state: any, action: any) => action.payload.id,
  [removeWaypoint as any]: (state: any, action: any) => action.payload.newSelectedId,
  [editCourse as any]: (state: any = [], action: any) => compose(
    prop('id'),
    head,
    prop('waypoints'))(
    action.payload),
  [removeUserData as any]: always(null)
}, null)

const isDefaultWaypointSelection = handleActions({
  [editCourse as any]: always(true),
  [selectWaypoint as any]: always(false),
  [addWaypoint as any]: always(false),
  [removeWaypoint as any]: always(false)
}, false)

const selectedMarkConfiguration = handleActions({
  [selectMarkConfiguration as any]: (state: any, action: any) => action.payload,
  [removeUserData as any]: always(null)
}, null)

export default combineReducers({
  all,
  courseLoading,
  selectedCourse,
  editedCourse,
  selectedWaypoint,
  isDefaultWaypointSelection,
  selectedMarkConfiguration
})
