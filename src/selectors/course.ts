import { prop, propEq, find, compose, path, defaultTo } from 'ramda'
import { createSelector } from 'reselect'
import uuidv4 from 'uuid/v4'

import {
  CourseState,
  CourseStateMap,
  GateSide,
} from 'models/Course'

const newCourse = () => {
  const startBoatId = uuidv4()
  const startPinId = uuidv4()
  const windwardMarkId = uuidv4()

  return {
    markConfigurations: [
      {id: startBoatId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Boat', shortName: 'SFB' }},
      {id: startPinId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Boat', shortName: 'SFB' }},
      {id: windwardMarkId, effectiveProperties: { markType: 'BUOY', name: 'Windward Mark', shortName: 'W' }}
    ],
    waypoints: [
      { passingInstruction: 'Gate', markConfigurationIds: [startBoatId, startPinId], controlPointName: 'Start', controlPointShortName: 'S' },
      { passingInstruction: 'Port', markConfigurationIds: [windwardMarkId] },
      { passingInstruction: 'Gate', markConfigurationIds: [startBoatId, startPinId], controlPointName: 'Finish', controlPointShortName: 'F' }]
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

export const getSelectedGateSide = (state: any): GateSide => state.courses.selectedGateSide
export const getSameStartFinish = (state: any): boolean => state.courses.sameStartFinish

export const getSelectedWaypoint = createSelector(
  getSelectedCourse,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (selectedCourse, waypointId) => find(propEq('id', waypointId), selectedCourse.waypoints))

export const getSelectedMarkConfiguration = createSelector(
  getSelectedWaypoint,
  state => state.courses.selectedMarkConfiguration,
  (selectedWaypoint, selectedMarkConfiguration) =>
  selectedMarkConfiguration || selectedWaypoint && selectedWaypoint.markConfigurationIds[0])

export const waypointLabel = (waypoint: any) => compose(
  course => waypoint.controlPointName || compose(
    defaultTo('\u2022'),
    path(['effectiveProperties', 'shortName']),
    find(propEq('id', waypoint.markConfigurationIds[0])),
    prop('markConfigurations'))(course),
  getSelectedCourse)