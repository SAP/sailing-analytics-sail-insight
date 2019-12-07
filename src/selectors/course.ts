import { prop, propEq, find, compose, path, defaultTo, equals, identity } from 'ramda'
import { createSelector } from 'reselect'
import uuidv4 from 'uuid/v4'

import {
  CourseState,
  CourseStateMap,
} from 'models/Course'

const newCourse = () => {
  const startBoatId = uuidv4()
  const startPinId = uuidv4()
  const windwardMarkId = uuidv4()

  return {
    markConfigurations: [
      {id: startBoatId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Boat', shortName: 'SFB' }},
      {id: startPinId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Pin', shortName: 'SFP' }},
      {id: windwardMarkId, effectiveProperties: { markType: 'BUOY', name: 'Windward Mark', shortName: 'W' }}
    ],
    waypoints: [
      { id: uuidv4(), passingInstruction: 'Gate', markConfigurationIds: [startPinId, startBoatId], controlPointName: 'Start', controlPointShortName: 'S' },
      { id: uuidv4(), passingInstruction: 'Port', markConfigurationIds: [windwardMarkId] },
      { id: uuidv4(), passingInstruction: 'Gate', markConfigurationIds: [ startPinId, startBoatId], controlPointName: 'Finish', controlPointShortName: 'F' }]
  }
}

export const getCourseLoading = (state: any): boolean => state.courses.courseLoading
export const getCourses = (state: any): CourseStateMap => state.courses.all

export const getCourseById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined)

export const getSelectedCourse = createSelector(
  getCourses,
  (state: any) => state.courses.selectedCourse,
  (courses, id) => courses[id] || newCourse())

export const getSameStartFinish = (state: any): boolean => state.courses.sameStartFinish

export const getSelectedWaypoint = createSelector(
  getSelectedCourse,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (selectedCourse, waypointId) => find(propEq('id', waypointId), selectedCourse.waypoints))

export const getSelectedMarkConfiguration = createSelector(
  getSelectedWaypoint,
  state => state.courses.selectedMarkConfiguration,
  (selectedWaypoint, selectedMarkConfiguration) =>
  selectedWaypoint && (find(equals(selectedMarkConfiguration), selectedWaypoint.markConfigurationIds) || selectedWaypoint.markConfigurationIds[0]))

export const getMarkPropertiesByMarkConfiguration = markConfigurationId => createSelector(
  getSelectedCourse,
  course => compose(
    prop('effectiveProperties'),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations'))(
    course))

export const getSelectedMarkProperties = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkPropertiesByMarkConfiguration(markConfigurationId)(state))

export const waypointLabel = (waypoint: any) => compose(
  course => waypoint.controlPointName || compose(
    defaultTo('\u2022'),
    path(['effectiveProperties', 'shortName']),
    find(propEq('id', waypoint.markConfigurationIds[0])),
    prop('markConfigurations'))(
    course),
  getSelectedCourse)
