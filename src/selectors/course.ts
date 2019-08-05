import { find, values } from 'lodash'
import { createSelector } from 'reselect'

import {
  ControlPointClass,
  GateSide,
  Mark,
  MarkMap,
  SelectedCourseState,
  SelectedEventInfo,
  SelectedRaceInfo,
  Waypoint,
  WaypointState,
} from 'models/Course'

export const getCourseLoading = (state: any): boolean =>
  state.courses.courseLoading

// Gets currently the "local ids" of marks
// TODO: Should be made to get all of the server ids of marks
const getMarkIds = (state: any): string[] => Object.keys(state.courses.marks)

const getMarks = (state: any): MarkMap => state.courses.marks

const getSelectedCourseState = (state: any): SelectedCourseState | undefined =>
  state.courses.selectedCourse

export const getSelectedGateSide = (state: any): GateSide =>
  state.courses.selectedGateSide

const getSelectedCourseWaypointState = createSelector(
  getSelectedCourseState,
  selectedCourseState => selectedCourseState && selectedCourseState.waypoints,
)

export const markByIdPresent = (markId: string) =>
  createSelector(
    getMarkIds,
    (markIds: string[]) => markIds.includes(markId),
  )

export const getMarkInventory = (state: any): Mark[] =>
  values(state.courses.marks)

const populateWaypointWithMarkData = (marks: MarkMap) => (
  waypointState: Partial<WaypointState>,
) => ({
  ...waypointState,
  controlPoint: waypointState.controlPoint && {
    ...waypointState.controlPoint,
    ...(waypointState.controlPoint.class === ControlPointClass.Mark
      ? marks[waypointState.controlPoint.id] || {}
      : {
          leftMark: waypointState.controlPoint.leftMark
            ? marks[waypointState.controlPoint.leftMark]
            : undefined,
          rightMark: waypointState.controlPoint.rightMark
            ? marks[waypointState.controlPoint.rightMark]
            : undefined,
        }),
  },
})

export const getSelectedCourseWithMarks = createSelector(
  getSelectedCourseState,
  getMarks,
  (selectedCourseState, marks) =>
    selectedCourseState && {
      name: selectedCourseState.name,
      waypoints: selectedCourseState.waypoints.map(
        populateWaypointWithMarkData(marks),
      ),
    },
)

const getSelectedWaypointState = createSelector(
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
  waypoint: Partial<Waypoint>,
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

export const getSelectedEventInfo = createSelector(
  (state: any): string | undefined => state.courses.selectedEvent,
  (state: any): any[] => values(state.checkIn.active),
  (selectedEvent, activeCheckIns): SelectedEventInfo | undefined =>
    selectedEvent && find(activeCheckIns, { eventId: selectedEvent }),
)

export const getSelectedRaceInfo = createSelector(
  getSelectedEventInfo,
  (state: any): string | undefined => state.courses.selectedRace,
  (selectedEvent, selectedRace): SelectedRaceInfo | undefined =>
    selectedEvent &&
    selectedRace && {
      ...selectedEvent,
      raceColumnName: selectedRace,
      fleet: 'Default', // TODO: This has to be the real fleet, but it will work with most cases with 'Default'
    } || undefined,
)
