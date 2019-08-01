import { find, get } from 'lodash'
import { compose, isNil, unless } from 'ramda'

import {
  ControlPointClass,
  Course,
  CourseState,
  Mark,
  Waypoint,
  WaypointState,
} from 'models/Course'
import { RootState } from 'reducers/config'

export const getCourseState = (raceId: string) => (
  state: RootState,
): CourseState | undefined => state.courses && state.courses.allCourses[raceId]

export const getCourseLoading = (state: RootState) =>
  state.courses && state.courses.courseLoading

// Gets currently the "local ids" of marks
// TODO: Should be made to get all of the server ids of marks
export const getMarkIds = (state: RootState) =>
  state.courses && state.courses.marks && Object.keys(state.courses.marks)

export const markdByIdPresent = (markId: string) => (state: RootState) =>
  getMarkIds(state).includes(markId)

export const getMarkById = (markId: string) => (
  state: RootState,
): Mark | undefined =>
  state.courses && state.courses.marks && state.courses.marks[markId]

const populateWaypointWithMarkData = (state: any) => (
  waypointState: Partial<WaypointState>,
) => ({
  ...waypointState,
  controlPoint: waypointState.controlPoint && {
    ...waypointState.controlPoint,
    ...(waypointState.controlPoint.class === ControlPointClass.Mark
      ? getMarkById(waypointState.controlPoint.id)(state) || {}
      : {
          leftMark: waypointState.controlPoint.leftMark
            ? getMarkById(waypointState.controlPoint.leftMark)(state)
            : undefined,
          rightMark: waypointState.controlPoint.rightMark
            ? getMarkById(waypointState.controlPoint.rightMark)(state)
            : undefined,
        }),
  },
})

export const getSelectedCourseWithMarks = (state: RootState) => {
  const selectedCourseState = getSelectedCourseState(state)
  if (!selectedCourseState) return

  return {
    name: selectedCourseState.name,
    waypoints: selectedCourseState.waypoints.map(
      populateWaypointWithMarkData(state),
    ),
  }
}

export const getSelectedCourseState = (state: any) =>
  state.courses.selectedCourse

export const getSelectedCourse = compose(
  getSelectedCourseWithMarks,
  getSelectedCourseState,
)

export const getWaypointStateById = (id?: string) => (
  state: any,
): Parital<WaypointState> | undefined =>
  id && find(get(state, 'courses.selectedCourse.waypoints') || [], { id })

export const getSelectedWaypointState = (state: any) =>
  getWaypointStateById(state.courses.selectedWaypoint)(state)

export const getSelectedWaypoint = (
  state: any,
): Partial<Waypoint> | undefined =>
  compose(
    unless(isNil, populateWaypointWithMarkData(state)),
    getSelectedWaypointState,
  )(state)

export const getSelectedMark = (state: any) =>
  state.courses.selectedMark && getMarkById(state.courses.selectedMark)(state)

export const getMarkInventory = (state: any) =>
  Object.values(state.courses.marks)
