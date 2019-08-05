import { find, get, values } from 'lodash'
import { compose, isNil, unless } from 'ramda'

import {
  ControlPointClass,
  Course,
  CourseState,
  GateSide,
  Mark,
  SelectedEventInfo,
  SelectedRaceInfo,
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

export const getSelectedGateSide = (state: any): GateSide =>
  state.courses.selectedGateSide

const getSelectedGateSideMarkFromWaypoint = (state: any) => (
  waypoint: Partial<Waypoint>,
) => {
  const controlPoint = waypoint.controlPoint
  if (!controlPoint) return undefined

  if (controlPoint.class === ControlPointClass.Mark) {
    return controlPoint
  } else {
    const selectedGateSide = getSelectedGateSide(state)
    return selectedGateSide === GateSide.LEFT
      ? controlPoint.leftMark
      : controlPoint.rightMark
  }
}

export const getSelectedMark = (state: any) =>
  compose(
    unless(isNil, getSelectedGateSideMarkFromWaypoint(state)),
    getSelectedWaypoint,
  )(state)

export const getMarkInventory = (state: any) =>
  Object.values(state.courses.marks)

export const getSelectedEventInfo = (state: any): SelectedEventInfo | undefined =>
  state.courses.selectedEvent &&
    find(values(state.checkIn.active) || [], { eventId: state.courses.selectedEvent })

export const getSelectedRaceInfo = (
  state: any
): SelectedRaceInfo | undefined => {
  const selectedEvent = getSelectedEventInfo(state);
  return (
    state.courses.selectedRace &&
    selectedEvent && {
      ...selectedEvent,
      raceColumnName: state.courses.selectedRace,
      fleet: "Default" // TODO: This has to be the real fleet, but it will work with most cases with 'Default'
    }
  );
};
