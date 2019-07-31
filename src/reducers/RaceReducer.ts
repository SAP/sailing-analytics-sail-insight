import { findIndex, propEq } from 'ramda'
import { handleActions } from 'redux-actions'

import { RaceState } from 'reducers/config'

import { removeUserData } from 'actions/auth'
import {
  addWaypoint,
  loadCourse,
  loadMark,
  removeWaypoint,
  selectCourse,
  selectWaypoint,
  toggleSameStartFinish,
  updateCourseLoading,
  updateWaypoint,
} from 'actions/races'
import { CourseState, Mark, MarkID, SelectedCourseState } from 'models/Course'

const insertItem = (array: any[], index: number, item: any) => {
  const newArray = array.slice()
  newArray.splice(index, 0, item)
  return newArray
}

const removeItem = (array: any[], index: number) => (
  array.filter((item: any, i: number) => i !== index)
)

interface itemWithId {
  id: string
}

// Update items but preserve ID
const updateItems = (array: itemWithId[], indices: number[], item: any = {}) => (
  array.map((it: itemWithId, ind: number) => {
    if (!indices.includes(ind)) {
      return it
    }

    return {
      id: it.id,
      ...item,
    }
  })
)

const getArrayIndexByWaypointId = (raceState: any) =>
  findIndex(propEq('id', raceState.selectedWaypoint))(raceState.selectedCourse.waypoints)

const getFinishWaypointIndex = (raceState: any) =>
  raceState.selectedCourse.waypoints.length - 1

const startOrFinishWaypointSelected = (raceState: any) =>
  getArrayIndexByWaypointId(raceState) === 0 ||
  getArrayIndexByWaypointId(raceState) === getFinishWaypointIndex(raceState)

const getWaypointIndicesToUpdate = (raceState: any) =>
  raceState.sameStartFinish && startOrFinishWaypointSelected(raceState)
    ? [0, getFinishWaypointIndex(raceState)]
    : [getArrayIndexByWaypointId(raceState)]

const SAME_START_FINISH_DEFAULT = false

const initialState: RaceState = {
  allRaces: {},
  courses: {} as Map<string, CourseState>,
  marks: {} as Map<MarkID, Mark>,
  courseLoading: false,
  selectedCourse: undefined,
  selectedWaypoint: undefined,
  sameStartFinish: SAME_START_FINISH_DEFAULT,
} as RaceState

const reducer = handleActions(
  {
    [loadCourse as any]: (state: any = {}, action: any) => ({
      ...state,
      courses: {
        ...state.courses,
        ...(action.payload || {}),
      },
    }),

    [loadMark as any]: (state: any = {}, action: any) => ({
      ...state,
      marks: {
        ...state.marks,
        ...(action.payload || {}),
      },
    }),

    [updateCourseLoading as any]: (state: any = {}, action: any) => ({
      ...state,
      courseLoading: !!action.payload,
    }),


    // Select course for loading into the course creation state
    // Course template (e.g. from scratch) or an existing course (when it is fetched from the server)
    // ({ courseId?: string, UUIDs: string[] }) => void
    [selectCourse as any]: (state: any = {}, action: any) => {
      const { courseId, UUIDs } = action.payload
      const courseExists = courseId && Object.keys(state.courses).includes(courseId)
      const selectedCourse: SelectedCourseState = courseExists
        ? state.courses[courseId]
        : {
            name: 'New course',
            waypoints: [
              {
                shortName: 'S',
                longName: 'Start',
                passingInstruction: 'Gate',
                id: UUIDs[0]
              },
              {
                shortName: 'F',
                longName: 'Finish',
                passingInstruction: 'Gate',
                id: UUIDs[1]
              }
            ]
          }

      return {
        ...state,
        selectedCourse,
        selectedWaypoint: undefined,
        sameStartFinish: SAME_START_FINISH_DEFAULT,
      }
    },

    // Create a new waypoint at a specified index and selects it
    // The index behaves like an Array.splice, i.e. an insertion, would
    // ({ UUID: string, index: number }) => void
    [addWaypoint as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedCourse: {
        ...state.selectedCourse,
        waypoints: insertItem(
          state.selectedCourse.waypoints,
          action.payload.index,
          { id: action.payload.UUID },
        ),
      },
      selectedWaypoint: action.payload.UUID,
    }),

    // Remove a new waypoint at the selectedWaypoint id
    [removeWaypoint as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedCourse: {
        ...state.selectedCourse,
        waypoints: removeItem(
          state.selectedCourse.waypoints,
          getArrayIndexByWaypointId(state),
        ),
      },
    }),

    // Change waypoint state at the selectedWaypoint id
    // (waypoint: Partial<WaypointState>) => void
    [updateWaypoint as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedCourse: {
        ...state.selectedCourse,
        waypoints: updateItems(
          state.selectedCourse.waypoints,
          getWaypointIndicesToUpdate(state),
          action.payload,
        ),
      },
    }),

    // Change selectedWaypoint
    // (selectedWaypoint: string) => void
    [selectWaypoint as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedWaypoint: action.payload,
    }),

    [toggleSameStartFinish as any]: (state: any = {}) => ({
      ...state,
      sameStartFinish: !state.sameStartFinish,
    }),

    [removeUserData as any]: () => initialState,

  },
  initialState,
)

export default reducer
