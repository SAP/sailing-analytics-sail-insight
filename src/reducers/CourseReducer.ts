import { get, head, keyBy, keys, last, mapKeys, mapValues, take } from 'lodash'
import { findIndex, propEq, compose, not, isNil, prop } from 'ramda'
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
  selectGateSide,
  selectWaypoint,
  toggleSameStartFinish,
  updateControlPoint,
  updateCourseLoading,
} from 'actions/courses'
import {
  ControlPointClass,
  ControlPointState,
  DefaultMark,
  DefaultMarkIdMap,
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

const updateItems = (array: any[], payload: { [index: number]: any }) =>
  array.map((it: any, ind: number) =>
    keys(payload)
      .map(Number)
      .includes(ind)
      ? payload[ind]
      : it,
  )

const getArrayIndexByWaypointId = (state: any) => (id: string) =>
  findIndex(propEq('id', id))(state.selectedCourse.waypoints)

const getSelectedWaypointArrayIndex = (state: any) =>
  getArrayIndexByWaypointId(state)(state.selectedWaypoint)

const getWaypointIdByArrayIndex = (state: any) => (index: number) =>
  get(state, ['selectedCourse', 'waypoints', index, 'id'])

const getFinishWaypointIndex = (state: any) =>
  state.selectedCourse.waypoints.length - 1

const getWaypointById = (state: any) => (id: string) =>
  get(state, [
    'selectedCourse',
    'waypoints',
    getArrayIndexByWaypointId(state)(id),
  ])

const getSelectedWaypoint = (state: any) =>
  state.selectedWaypoint && getWaypointById(state)(state.selectedWaypoint)

const updateWaypointReducer = (
  state: any,
  payload: { [index: number]: Partial<WaypointState> },
) => ({
  selectedCourse: {
    ...state.selectedCourse,
    waypoints: updateItems(
      state.selectedCourse.waypoints,
      payload,
    ),
  },
})

const updateSelectedWaypointReducer = (
  state: any,
  waypointState: Partial<WaypointState>,
) => updateWaypointReducer(state, { [getSelectedWaypointArrayIndex(state)]: waypointState })


const updateControlPointReducer = (
  state: any,
  payload: { [index: number]: ControlPointState },
) => {
  const changedWaypointPayload = mapValues(payload, (controlPointState, index) => ({
    ...(state.selectedCourse.waypoints[index] || {}),
    passingInstruction: controlPointState.passingInstruction,
    controlPoint: controlPointState,
  }))

  return updateWaypointReducer(state, changedWaypointPayload)
}

const updateSelectedControlPointReducer = (
  state: any,
  controlPointState: ControlPointState,
) => updateControlPointReducer(state, { [getSelectedWaypointArrayIndex(state)]: controlPointState })

const SAME_START_FINISH_DEFAULT = true
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
      shortName: 'W',
    },
    [DefaultMark.ReachingMark]: {
      longName: 'Reaching Mark',
      shortName: 'R',
    },
    [DefaultMark.LeewardMark]: {
      longName: 'Leeward Mark',
      shortName: 'L',
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
      passingInstruction: PassingInstruction.Port
    }),
  )

  const defaultMarks: MarkMap = mapKeys(defaultMarksWithFullInformation, value => value.id)
  const defaultMarkIds: DefaultMarkIdMap = mapValues(defaultMarksWithFullInformation, value => value.id)

  return { defaultMarks, defaultMarkIds }
}

const { defaultMarks, defaultMarkIds } = constructDefaultMarks()

const initialState: CourseReducerState = {
  allCourses: {},
  marks: defaultMarks,
  markPairs: {},
  courseLoading: false,
  selectedCourse: undefined,
  selectedWaypoint: undefined,
  sameStartFinish: SAME_START_FINISH_DEFAULT,
  selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
  defaultMarkIds,
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

      const courseExists = compose(not, isNil, prop(courseId), prop('allCourses'))(state)
      const defaultMarkIds = state.defaultMarkIds

      const selectedCourse: SelectedCourseState = courseExists
        ? state.allCourses[courseId]
        : {
            waypoints: [
              {
                passingInstruction: PassingInstruction.Gate,
                id: UUIDs[0],
                controlPoint: {
                  class: ControlPointClass.MarkPair,
                  id: UUIDs[1],
                  leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
                  rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
                  longName: 'Start',
                  shortName: 'S',
                },
              },
              {
                passingInstruction: PassingInstruction.Gate,
                id: UUIDs[2],
                controlPoint: {
                  class: ControlPointClass.MarkPair,
                  id: UUIDs[3],
                  leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
                  rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
                  longName: 'Finish',
                  shortName: 'F',
                },
              },
            ],
          }

      return {
        ...state,
        selectedCourse,
        selectedWaypoint: selectedCourse.waypoints[0].id,
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
      selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
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
        ...updateSelectedWaypointReducer(state, changedWaypoint),
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
      ...updateSelectedControlPointReducer(state, action.payload),
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

    [toggleSameStartFinish as any]: (state: any = {}) => {
      const sameStartFinish = state.sameStartFinish

      const startControlPoint = head(state.selectedCourse.waypoints).controlPoint
      const finishControlPoint = last(state.selectedCourse.waypoints).controlPoint

      const { defaultMarkIds, marks } = state

      const changedControlPointPayload = {
        0: {
          ...startControlPoint,
          ...(sameStartFinish
            ? {
              leftMark: defaultMarkIds[DefaultMark.StartPin],
              rightMark: defaultMarkIds[DefaultMark.StartBoat],
            }
            : {
              leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
              rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
            }
          )
        },

        [getFinishWaypointIndex(state)]: {
          ...finishControlPoint,
          ...(sameStartFinish
            ? {
              leftMark: defaultMarkIds[DefaultMark.FinishPin],
              rightMark: defaultMarkIds[DefaultMark.FinishBoat],
            }
            : {
              leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
              rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
            }
          )
        },
      }

      const defaultMarks = mapValues(defaultMarkIds, id => marks[id])
      const changedMarks = sameStartFinish
        ? {
          [defaultMarkIds[DefaultMark.StartPin]]: {
            ...defaultMarks[DefaultMark.StartPin],
            position: defaultMarks[DefaultMark.StartFinishPin].position ||
                      defaultMarks[DefaultMark.StartPin].position,
          },
          [defaultMarkIds[DefaultMark.StartBoat]]: {
            ...defaultMarks[DefaultMark.StartBoat],
            position: defaultMarks[DefaultMark.StartFinishBoat].position ||
                      defaultMarks[DefaultMark.StartBoat].position,
          },
        }
        : {
          [defaultMarkIds[DefaultMark.StartFinishPin]]: {
            ...defaultMarks[DefaultMark.StartFinishPin],
            position: defaultMarks[DefaultMark.StartPin].position ||
                      defaultMarks[DefaultMark.StartFinishPin].position,
          },
          [defaultMarkIds[DefaultMark.StartFinishBoat]]: {
            ...defaultMarks[DefaultMark.StartFinishBoat],
            position: defaultMarks[DefaultMark.StartBoat].position ||
                      defaultMarks[DefaultMark.StartFinishBoat].position,
          },
        }

      return {
        ...state,
        ...updateControlPointReducer(state, changedControlPointPayload),
        sameStartFinish: !sameStartFinish,
        marks: {
          ...state.marks,
          ...changedMarks,
        },
      }
    },

    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
