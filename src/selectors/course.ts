import { prop, propEq, find, compose, path, defaultTo,
  equals, identity, head, when, isNil, always, last,
  apply, map, take, move, evolve, dissoc, not } from 'ramda'
import { createSelector } from 'reselect'
import { getSelectedEventInfo } from 'selectors/event'

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
  getSelectedEventInfo,
  (state: any) => state.courses.selectedCourse,
  getCourses,
  (selectedEventInfo, selectedCourseInfo, courses) => courses[`${selectedEventInfo.regattaName} - ${selectedCourseInfo.race}`])

export const getEditedCourse = (state: any) => state.courses.editedCourse

export const getSelectedWaypoint = createSelector(
  getEditedCourse,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (editedCourse, waypointId) => find(propEq('id', waypointId), editedCourse.waypoints))

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
  compose(
    defaultTo({}),
    prop('effectiveProperties'),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

export const getMarkPositionByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    path(['effectivePositioning', 'position']),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

export const getMarkDeviceTrackingByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    path(['effectivePositioning', 'deviceUUID']),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

export const getSelectedMarkProperties = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkPropertiesByMarkConfiguration(markConfigurationId)(state))

export const getSelectedMarkDeviceTracking = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkDeviceTrackingByMarkConfiguration(markConfigurationId)(state))

export const getSelectedMarkPosition = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkPositionByMarkConfiguration(markConfigurationId)(state))

export const hasSameStartFinish = createSelector(
  getEditedCourse,
  compose(
    apply(equals),
    map(prop('markConfigurationIds')),
    take(2),
    move(-1, 0),
    prop('waypoints')))

export const hasEditedCourseChanged = createSelector(
  getSelectedCourse,
  getEditedCourse,
  (selectedCourse, editedCourse) => compose(
    not,
    equals(evolve({ waypoints: map(dissoc('id')) }, selectedCourse)),
    evolve({ waypoints: map(dissoc('id')) }))(
    editedCourse))

export const waypointLabel = (waypoint: any) => compose(
  course => {
    const isStartOrFinish = head(course.waypoints).id === waypoint.id || last(course.waypoints).id === waypoint.id

    return isStartOrFinish ? waypoint.controlPointName : waypoint.controlPointShortName || compose(
      defaultTo('\u2022'),
      path(['effectiveProperties', 'shortName']),
      find(propEq('id', compose(head, defaultTo([]), prop('markConfigurationIds'))(waypoint))),
      prop('markConfigurations'))(
      course)
  },
  getEditedCourse)
