import { concat, find, mapValues, values } from 'lodash'
import { append, compose, contains, flip, gt, length, map, pick, prepend, prop, reject, slice, unless } from 'ramda'
import { createSelector } from 'reselect'

import {
  ControlPoint,
  ControlPointClass,
  ControlPointState,
  CourseState,
  CourseStateMap,
  DefaultMark,
  DefaultMarkIdMap,
  GateSide,
  MarkMap,
  MarkPairMap,
  SelectedCourseState,
  WaypointState,
} from 'models/Course'

export const getCourseLoading = (state: any): boolean =>
  state.courses.courseLoading

const getCourses = (state: any): CourseStateMap => state.courses.allCourses
const getCourseStateById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined
)

const getCourseById = (courseId: string) => createSelector(
  getCourseStateById(courseId),
  getMarks,
  populateCourseWithMarks,
)

// Gets currently the "local ids" of marks
// TODO: Should be made to get all of the server ids of marks
const getMarkIds = (state: any): string[] => Object.keys(state.courses.marks)

export const getMarks = (state: any): MarkMap => state.courses.marks

const getMarkPairState = (state: any): MarkPairMap => state.courses.markPairs
const getMarkPairs = createSelector(
  getMarks,
  getMarkPairState,
  (marks, markPairState) => mapValues(markPairState, populateControlPointWithMarkData(marks))
)

export const getSelectedCourseState = (state: any): SelectedCourseState | undefined =>
  state.courses.selectedCourse

export const getSelectedGateSide = (state: any): GateSide =>
  state.courses.selectedGateSide

const getSameStartFinish = (state: any): boolean => state.courses.sameStartFinish
const getDefaultMarkIds = (state: any): DefaultMarkIdMap => state.courses.defaultMarkIds

const getSelectedCourseWaypointState = createSelector(
  getSelectedCourseState,
  selectedCourseState => selectedCourseState && selectedCourseState.waypoints,
)

// The first and last array elements should be ['S', 'F']
export const getCourseShortNameLabel = (courseId: string) => createSelector(
  getCourseById(courseId),
  course => course && compose(
    unless(
      compose(gt(2), length),
      compose(
        prepend('S'),
        append('F'),
        slice(1, -1),
      ),
    ),
    map((waypoint: any) => waypoint.controlPoint.shortName || '?')
  )(course.waypoints)
)

export const markByIdPresent = (markId: string) =>
  createSelector(
    getMarkIds,
    (markIds: string[]) => markIds.includes(markId),
  )

const getCompleteMarkInventory = createSelector(
  getMarks,
  getMarkPairs,
  (marks, markPairs) => concat(values(marks), values(markPairs)) as ControlPoint[]
)

const sameStartFinishOnFilteredDefaultMarks = [
  DefaultMark.StartPin,
  DefaultMark.StartBoat,
  DefaultMark.FinishPin,
  DefaultMark.FinishBoat,
]

const sameStartFinishOffFilteredDefaultMarks = [
  DefaultMark.StartFinishPin,
  DefaultMark.StartFinishBoat,
]

export const getMarkInventory = createSelector(
  getCompleteMarkInventory,
  getSameStartFinish,
  getDefaultMarkIds,
  (markInventory, sameStartFinish, defaultMarkIds) => {
    return reject(compose(
      flip(contains)(compose(
        values,
        pick(sameStartFinish
          ? sameStartFinishOnFilteredDefaultMarks
          : sameStartFinishOffFilteredDefaultMarks
        )
      )(defaultMarkIds)),
      prop('id'),
    ))(markInventory)
  },
)

const populateControlPointWithMarkData = (marks: MarkMap) => (
  controlPoint: ControlPointState,
) => ({
  ...controlPoint,
  ...(controlPoint.class === ControlPointClass.Mark
    ? marks[controlPoint.id] || {}
    : {
        leftMark: controlPoint.leftMark
          ? marks[controlPoint.leftMark]
          : undefined,
        rightMark: controlPoint.rightMark
          ? marks[controlPoint.rightMark]
          : undefined,
      }),
})

const populateWaypointWithMarkData = (marks: MarkMap) => (
  waypointState: Partial<WaypointState>,
) => ({
  ...waypointState,
  controlPoint:
    waypointState.controlPoint &&
    populateControlPointWithMarkData(marks)(waypointState.controlPoint),
})

const populateCourseWithMarks = (
  courseState: SelectedCourseState | undefined,
  marks: MarkMap,
) =>
  courseState && {
    ...courseState,
    waypoints: courseState.waypoints.map(populateWaypointWithMarkData(marks)),
  }

export const getSelectedCourseWithMarks = createSelector(
  getSelectedCourseState,
  getMarks,
  populateCourseWithMarks,
)

export const getSelectedWaypointState = createSelector(
  getSelectedCourseWaypointState,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (selectedCourseWaypointState, selectedWaypoint) =>
    selectedWaypoint &&
    find(selectedCourseWaypointState || [], { id: selectedWaypoint }),
)

export const getSelectedWaypoint = createSelector(
  getSelectedWaypointState,
  getMarks,
  (selectedWaypointState, marks) =>
    selectedWaypointState &&
    populateWaypointWithMarkData(marks)(selectedWaypointState),
)

const getSelectedGateSideMarkFromWaypoint = (selectedGateSide: GateSide) => (
  // To add a type for this it should be compatible with both Partial<Waypoint>
  // and the return type of populateWaypointWithMarkData which returns
  // something similar to Partial<Waypoint> except with possible undefined values
  // for the mark[s] in the control point
  waypoint: any,
) => {
  const controlPoint = waypoint.controlPoint
  if (!controlPoint) return undefined

  if (controlPoint.class === ControlPointClass.Mark) {
    return controlPoint
  }

  return selectedGateSide === GateSide.LEFT
    ? controlPoint.leftMark
    : controlPoint.rightMark
}

export const getSelectedMark = createSelector(
  getSelectedWaypoint,
  getSelectedGateSide,
  (selectedWaypoint, selectedGateSide) =>
    selectedWaypoint &&
    getSelectedGateSideMarkFromWaypoint(selectedGateSide)(selectedWaypoint),
)
