import { get } from 'lodash'
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
  selectMark,
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

const getArrayIndexByWaypointId = (raceState: any) => (id: string) =>
  findIndex(propEq('id', id))(raceState.selectedCourse.waypoints)

const getSelectedWaypointArrayIndex = (raceState: any) =>
  getArrayIndexByWaypointId(raceState)(raceState.selectedWaypoint)

const getWaypointIdByArrayIndex = (raceState: any) => (index: number) =>
  get(raceState, ['selectedCourse', 'waypoints', index, 'id'])

const getFinishWaypointIndex = (raceState: any) =>
  raceState.selectedCourse.waypoints.length - 1

const startOrFinishWaypointSelected = (raceState: any) =>
  getSelectedWaypointArrayIndex(raceState) === 0 ||
  getSelectedWaypointArrayIndex(raceState) === getFinishWaypointIndex(raceState)

const getWaypointIndicesToUpdate = (raceState: any) =>
  raceState.sameStartFinish && startOrFinishWaypointSelected(raceState)
    ? [0, getFinishWaypointIndex(raceState)]
    : [getSelectedWaypointArrayIndex(raceState)]

const getWaypointById = (raceState: any) => (id: string) =>
  get(raceState, [
    "selectedCourse",
    "waypoints",
    getArrayIndexByWaypointId(raceState)(id)
  ]);


const SAME_START_FINISH_DEFAULT = false
const SELECTED_WAYPOINT_DEFAULT = undefined
const SELECTED_MARK_DEFAULT = undefined

const initialState: RaceState = {
  allRaces: {},
  courses: {} as Map<string, CourseState>,
  marks: {} as Map<MarkID, Mark>,
  courseLoading: false,
  selectedCourse: undefined,
  selectedWaypoint: SELECTED_WAYPOINT_DEFAULT,
  sameStartFinish: SAME_START_FINISH_DEFAULT,
  selectedMark: SELECTED_MARK_DEFAULT,
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
            ],
        }

      return {
        ...state,
        selectedCourse,
        selectedWaypoint: SELECTED_WAYPOINT_DEFAULT,
        sameStartFinish: SAME_START_FINISH_DEFAULT,
        selectedMark: SELECTED_MARK_DEFAULT,
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
          getSelectedWaypointArrayIndex(state),
        ),
      },
      selectedWaypoint: getWaypointIdByArrayIndex(state)(
        getSelectedWaypointArrayIndex(state) - 1
      )
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
      // Select left mark
      selectedMark: get(getWaypointById(state)(action.payload), 'leftMark')
    }),

    // Change selectedMark
    // (selectedMark: string) => void
    [selectMark as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedMark: action.payload,
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
