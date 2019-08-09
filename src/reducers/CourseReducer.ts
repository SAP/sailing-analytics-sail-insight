import { get } from 'lodash'
import { compose, findIndex, isNil, propEq, unless } from 'ramda'
import { handleActions } from 'redux-actions'

import { CourseReducerState } from 'reducers/config'

import { removeUserData } from 'actions/auth'
import {
  addWaypoint,
  loadCourse,
  loadMark,
  loadMarkPair,
  removeWaypoint,
  saveMark,
  selectCourse,
  selectEvent,
  selectGateSide,
  selectRace,
  selectWaypoint,
  toggleSameStartFinish,
  updateControlPoint,
  updateCourseLoading,
  updateWaypoint,
} from 'actions/courses'
import {
  ControlPointClass,
  ControlPointState,
  GateSide,
  Mark,
  PassingInstruction,
  SelectedCourseState,
  WaypointState,
} from 'models/Course'

const insertItem = (array: any[], index: number, item: any) => {
  const newArray = array.slice()
  newArray.splice(index, 0, item)
  return newArray
}

const removeItem = (array: any[], index: number) =>
  array.filter((item: any, i: number) => i !== index)

interface itemWithId {
  id: string
}

// Update items but preserve ID
const updateItems = (array: itemWithId[], indices: number[], item: any = {}) =>
  array.map((it: itemWithId, ind: number) => {
    if (!indices.includes(ind)) {
      return it
    }

    return {
      ...item,
      id: it.id,
    }
  })

const getArrayIndexByWaypointId = (state: any) => (id: string) =>
  findIndex(propEq('id', id))(state.selectedCourse.waypoints)

const getSelectedWaypointArrayIndex = (state: any) =>
  getArrayIndexByWaypointId(state)(state.selectedWaypoint)

const getWaypointIdByArrayIndex = (state: any) => (index: number) =>
  get(state, ['selectedCourse', 'waypoints', index, 'id'])

const getFinishWaypointIndex = (state: any) =>
  state.selectedCourse.waypoints.length - 1

const startOrFinishWaypointSelected = (state: any) =>
  getSelectedWaypointArrayIndex(state) === 0 ||
  getSelectedWaypointArrayIndex(state) === getFinishWaypointIndex(state)

const getWaypointIndicesToUpdate = (state: any) =>
  state.sameStartFinish && startOrFinishWaypointSelected(state)
    ? [0, getFinishWaypointIndex(state)]
    : [getSelectedWaypointArrayIndex(state)]

const getWaypointById = (state: any) => (id: string) =>
  get(state, [
    'selectedCourse',
    'waypoints',
    getArrayIndexByWaypointId(state)(id),
  ])

const getSelectedWaypoint = (state: any) =>
  state.selectedWaypoint && getWaypointById(state)(state.selectedWaypoint)

const getSelectedControlPoint = compose(
  unless(isNil, (waypoint: any) => waypoint.controlPoint),
  getSelectedWaypoint,
)

const getSelectedGateSide = (state: any) => state.selectedGateSide

const updateWaypointReducer = (
  state: any,
  waypointState: Partial<WaypointState>,
) => ({
  selectedCourse: {
    ...state.selectedCourse,
    waypoints: updateItems(
      state.selectedCourse.waypoints,
      getWaypointIndicesToUpdate(state),
      waypointState,
    ),
  },
})

const updateControlPointReducer = (
  state: any,
  controlPointState: ControlPointState,
) =>
  updateWaypointReducer(state, {
    ...(getSelectedWaypoint(state) || {}),
    controlPoint: controlPointState,
  })

const SAME_START_FINISH_DEFAULT = true
const SELECTED_WAYPOINT_DEFAULT = undefined
const SELECTED_GATE_SIDE_DEFAULT = GateSide.LEFT

const initialState: CourseReducerState = {
  allCourses: {},
  marks: {},
  markPairs: {},
  courseLoading: false,
  selectedCourse: undefined,
  selectedWaypoint: SELECTED_WAYPOINT_DEFAULT,
  sameStartFinish: SAME_START_FINISH_DEFAULT,
  selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,

  selectedEvent: undefined,
  selectedRace: undefined,
} as CourseReducerState

const reducer = handleActions(
  {
    [loadCourse as any]: (state: any = {}, action: any) => ({
      ...state,
      allCourses: {
        ...state.allCourses,
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

    [loadMarkPair as any]: (state: any = {}, action: any) => ({
      ...state,
      markPairs: {
        ...state.markPairs,
        ...(action.payload || {}),
      },
    }),

    [updateCourseLoading as any]: (state: any = {}, action: any) => ({
      ...state,
      courseLoading: !!action.payload,
    }),

    // (mark: Mark)
    [saveMark as any]: (state: any = {}, action: any) => {
      const mark: Mark = action.payload
      const selectedControlPoint: ControlPointState | undefined =
        getSelectedControlPoint(state)
      const selectedGateSide: GateSide = getSelectedGateSide(state)

      const changedControlPoint = selectedControlPoint && {
        ...selectedControlPoint,
        ...(selectedControlPoint.class === ControlPointClass.Mark
          ? { id: mark.id }
          : {
            leftMark: selectedGateSide === GateSide.LEFT ? mark.id : selectedControlPoint.leftMark,
            rightMark: selectedGateSide === GateSide.RIGHT ? mark.id : selectedControlPoint.rightMark,
          }
        )
      }
      if (!mark || !mark.id) return state
      return {
        ...state,
        ...(changedControlPoint
          ? updateControlPointReducer(state, changedControlPoint)
          : {}),
        marks: {
          ...state.marks,
          [mark.id]: mark,
        },
      }
    },

    // Select course for loading into the course creation state
    // Course template (e.g. from scratch) or an existing course (when it is fetched from the server)
    // ({ courseId?: string, UUIDs: string[] }) => void
    [selectCourse as any]: (state: any = {}, action: any) => {
      const { courseId, UUIDs } = action.payload
      const courseExists =
        courseId && Object.keys(state.allCourses).includes(courseId)
      const selectedCourse: SelectedCourseState = courseExists
        ? state.allCourses[courseId]
        : {
            name: 'New course',
            waypoints: [
              {
                passingInstruction: 'Gate',
                id: UUIDs[0],
                controlPoint: {
                  class: ControlPointClass.MarkPair,
                  id: UUIDs[1],
                },
              },
              {
                passingInstruction: 'Gate',
                id: UUIDs[2],
                controlPoint: {
                  class: ControlPointClass.MarkPair,
                  id: UUIDs[3],
                },
              },
            ],
          }

      return {
        ...state,
        selectedCourse,
        selectedWaypoint: SELECTED_WAYPOINT_DEFAULT,
        sameStartFinish: SAME_START_FINISH_DEFAULT,
        selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
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
    [removeWaypoint as any]: (state: any = {}, action: any) => {
      const selectedWaypoint = getWaypointIdByArrayIndex(state)(
        getSelectedWaypointArrayIndex(state) - 1,
      )

      return {
        ...state,
        selectedCourse: {
          ...state.selectedCourse,
          waypoints: removeItem(
            state.selectedCourse.waypoints,
            getSelectedWaypointArrayIndex(state),
          ),
        },
        // Selects a waypoint to the left and autoselects the mark
        selectedWaypoint,
        selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
      }
    },

    // Change waypoint state at the selectedWaypoint id
    [updateWaypoint as any]: (state: any = {}, action: any) => {
      const {
        passingInstruction,
        markPairLongName,
      }: {
        passingInstruction: PassingInstruction
        markPairLongName?: string
      } = action.payload

      const selectedWaypoint: WaypointState | undefined = getSelectedWaypoint(state)

      if (!selectedWaypoint) return state

      const changedWaypoint = {
        ...selectedWaypoint,
        passingInstruction,
        ...(markPairLongName &&
        selectedWaypoint.controlPoint.class === ControlPointClass.MarkPair
          ? {
              controlPoint: {
                ...selectedWaypoint.controlPoint,
                longName: markPairLongName,
              },
            }
          : {}),
      }

      return {
        ...state,
        ...updateWaypointReducer(state, changedWaypoint),
      }
    },

    // Change controlPoint state of the waypoint at the selectedWaypoint id
    // (controlPointState: Partial<ControlPointState>) => void
    [updateControlPoint as any]: (state: any = {}, action: any) => ({
      ...state,
      ...updateControlPointReducer(state, action.payload),
    }),

    // Change selectedWaypoint
    // (selectedWaypoint: string) => void
    [selectWaypoint as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedWaypoint: action.payload,
      selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
    }),

    // Change selectedGateSide
    // (selectedGateSide: GateSide) => void
    [selectGateSide as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedGateSide: action.payload,
    }),

    [toggleSameStartFinish as any]: (state: any = {}) => ({
      ...state,
      sameStartFinish: !state.sameStartFinish,
    }),

    [selectEvent as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedEvent: action.payload,
    }),

    [selectRace as any]: (state: any = {}, action: any) => ({
      ...state,
      selectedRace: action.payload,
    }),

    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
