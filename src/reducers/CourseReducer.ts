import { get, keyBy, mapKeys, mapValues, take  } from 'lodash'
import { compose, findIndex, isNil, propEq, unless } from 'ramda'
import { handleActions } from 'redux-actions'
import uuidv4 from 'uuid/v4'

import { CourseReducerState } from 'reducers/config'

import { removeUserData } from 'actions/auth'
import {
  addWaypoint,
  loadCourse,
  loadMark,
  loadMarkPair,
  removeWaypoint,
  saveWaypoint,
  selectCourseForEditing,
  selectEvent,
  selectGateSide,
  selectRace,
  selectWaypoint,
  toggleSameStartFinish,
  updateControlPoint,
  updateCourseLoading,
} from 'actions/courses'
import {
  ControlPointClass,
  ControlPointState,
  DefaultMark,
  DefaultMarkMap,
  GateSide,
  Mark,
  MarkMap,
  MarkType,
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

const constructDefaultMarks = () => {
  const defaultMarkNames = {
    [DefaultMark.StartFinishPin]: {
      longName: 'Start/Finish Pin',
      shortName: 'SFP',
    },
    [DefaultMark.StartFinishBoat]: {
      longName: 'Start/Finish Boat',
      shortName: 'SFB',
    },
    [DefaultMark.WindwardMark]: {
      longName: 'Windward Mark',
      shortName: '1',
    },
    [DefaultMark.ReachingMark]: {
      longName: 'Reaching Mark',
      shortName: '2',
    },
    [DefaultMark.LeewardMark]: {
      longName: 'Leeward Mark',
      shortName: '3',
    },
    [DefaultMark.StartPin]: {
      longName: 'Start Pin',
      shortName: 'SP',
    },
    [DefaultMark.StartBoat]: {
      longName: 'Start Boat',
      shortName: 'SB',
    },
    [DefaultMark.FinishPin]: {
      longName: 'Finish Pin',
      shortName: 'FP',
    },
    [DefaultMark.FinishBoat]: {
      longName: 'Finish Boat',
      shortName: 'FB',
    },
  }

  // This mapping can be considered as what the API returns when creating the marks
  const defaultMarksWithFullInformation = mapValues(
    defaultMarkNames,
    mark => ({
      ...mark,
      id: uuidv4(),
      class: ControlPointClass.Mark,
      type: MarkType.Buoy,
    }),
  )

  const defaultMarks: MarkMap = mapKeys(defaultMarksWithFullInformation, value => value.id)
  const defaultMarkMap: DefaultMarkMap = mapValues(defaultMarksWithFullInformation, value => value.id)

  return { defaultMarks, defaultMarkMap }
}

const { defaultMarks, defaultMarkMap } = constructDefaultMarks()

const initialState: CourseReducerState = {
  allCourses: {},
  marks: defaultMarks,
  markPairs: {},
  courseLoading: false,
  selectedCourse: undefined,
  selectedWaypoint: SELECTED_WAYPOINT_DEFAULT,
  sameStartFinish: SAME_START_FINISH_DEFAULT,
  selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,

  selectedEvent: undefined,
  selectedRace: undefined,

  defaultMarkMap,
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

    // Select course for loading into the course creation state
    // Course template (e.g. from scratch) or an existing course (when it is fetched from the server)
    // ({ courseId?: string, UUIDs: string[] }) => void
    [selectCourseForEditing as any]: (state: any = {}, action: any) => {
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

    [saveWaypoint as any]: (state: any = {}, action: any) => {
      const {
        marks,
        passingInstruction,
        markPairLongName,
      }: {
        marks: Mark[]
        passingInstruction: PassingInstruction
        markPairLongName?: string
      } = action.payload

      const selectedWaypoint: WaypointState | undefined = getSelectedWaypoint(state)

      if (!selectedWaypoint) return state

      const controlPoint = selectedWaypoint.controlPoint

      if (
        (controlPoint.class === ControlPointClass.Mark && marks.length < 1) ||
        (controlPoint.class === ControlPointClass.MarkPair && marks.length < 2)
      ) return state

      const changedControlPoint = {
        ...controlPoint,
        ...(controlPoint.class === ControlPointClass.Mark
          ? { id: marks[0].id }
          : {
            leftMark: marks[0].id,
            rightMark: marks[1].id,
            longName: markPairLongName || controlPoint.longName,
          }
        )
      }

      const changedWaypoint = {
        ...selectedWaypoint,
        passingInstruction,
        controlPoint: changedControlPoint,
      }

      const marksToSave = controlPoint.class === ControlPointClass.Mark ?
        take(marks, 1) : take(marks, 2)

      return {
        ...state,
        ...updateWaypointReducer(state, changedWaypoint),
        marks: {
          ...state.marks,
          ...keyBy(marksToSave, 'id'),
        }
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
