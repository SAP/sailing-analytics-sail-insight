import { prop, propEq, find, compose, path, defaultTo } from 'ramda'
import { createSelector } from 'reselect'

import {
  CourseState,
  CourseStateMap,
  GateSide,
  SelectedCourseState,
} from 'models/Course'

export const getCourseLoading = (state: any): boolean =>
  state.courses.courseLoading

const getCourses = (state: any): CourseStateMap => state.courses.all

export const getCourseById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined)

export const getSelectedCourseId = (state: any): SelectedCourseState | undefined =>
  state.courses.selectedCourse

export const getSelectedCourse = createSelector(
  getCourses,
  getSelectedCourseId,
  (courses, id) => courses[id])

export const getSelectedGateSide = (state: any): GateSide =>
  state.courses.selectedGateSide

export const getSameStartFinish = (state: any): boolean => state.courses.sameStartFinish

const getSelectedCourseWaypoints = createSelector(
  getSelectedCourse,
  prop('waypoints'))

export const getSelectedWaypoint = createSelector(
  getSelectedCourseWaypoints,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (courseWaypoints, selectedWaypoint) =>
    selectedWaypoint && find(propEq('id', selectedWaypoint), courseWaypoints))

export const waypointLabel = waypoint => compose(
  course => waypoint.controlPointName || compose(
    defaultTo('\u2022'),
    path(['effectiveProperties', 'shortName']),
    find(propEq('id', waypoint.markConfigurationIds[0])),
    prop('markConfigurations'))(course),
  getSelectedCourse)