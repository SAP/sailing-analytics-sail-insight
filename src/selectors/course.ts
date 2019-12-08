import { prop, propEq, find, compose, path, defaultTo,
  equals, identity, head, when, isNil, always } from 'ramda'
import { createSelector } from 'reselect'

import {
  CourseState,
  CourseStateMap,
} from 'models/Course'

export const getCourseLoading = (state: any): boolean => state.courses.courseLoading
export const getCourses = (state: any): CourseStateMap => state.courses.all

export const getCourseById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined)

export const getSelectedCourse = createSelector(
  getCourses,
  (state: any) => state.courses.selectedCourse,
  (courses, id) => courses[id])

export const getEditedCourse = (state: any) => state.courses.editedCourse
export const getSameStartFinish = (state: any): boolean => state.courses.sameStartFinish

export const getSelectedWaypoint = createSelector(
  getEditedCourse,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (selectedCourse, waypointId) => find(propEq('id', waypointId), selectedCourse.waypoints))

export const getSelectedMarkConfiguration = createSelector(
  getSelectedWaypoint,
  state => state.courses.selectedMarkConfiguration,
  (selectedWaypoint, selectedMarkConfiguration) =>
  selectedWaypoint && compose(
    when(isNil, always(head(selectedWaypoint.markConfigurationIds || []))),
    find(equals(selectedMarkConfiguration)),
    defaultTo([]),
    prop('markConfigurationIds'))(
    selectedWaypoint))

export const getMarkPropertiesByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  course => compose(
    defaultTo({}),
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
    find(propEq('id', compose(head, defaultTo([]), prop('markConfigurationIds'))(waypoint))),
    prop('markConfigurations'))(
    course),
  getEditedCourse)
