import { prop, propEq, find } from 'ramda'
import { createSelector } from 'reselect'

import {
  CourseState,
  CourseStateMap,
  GateSide,
  SelectedCourseState,
} from 'models/Course'

export const getCourseLoading = (state: any): boolean =>
  state.courses.courseLoading

const getCourses = (state: any): CourseStateMap => state.courses.allCourses

export const getCourseById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined)

export const getSelectedCourse = (state: any): SelectedCourseState | undefined =>
  state.courses.selectedCourse

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