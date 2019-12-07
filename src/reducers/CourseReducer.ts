import { merge } from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

import { removeUserData } from 'actions/auth'
import {
  loadCourse,
  selectCourse,
  updateCourseLoading,
} from 'actions/courses'

const all = handleActions({
  [loadCourse as any]: (state: any = {}, action: any) =>
    merge(state, action.payload || {})
}, {})

const selectedCourse = handleActions({
  [selectCourse as any]: (state, action) => action.payload
}, null)

const courseLoading = handleActions({
  [updateCourseLoading as any]: (state: any = {}, action: any) => action.payload
}, false)

export default combineReducers({
  all,
  selectedCourse,
  courseLoading
})

// const reducer = handleActions(
//   {
//     [loadCourse as any]: (state: any = {}, action: any) => ({
//       ...state,
//       allCourses: {
//         ...state.allCourses,
//         ...(action.payload || {}),
//       },
//     }),

//     [updateCourseLoading as any]: (state: any = {}, action: any) => ({
//       ...state,
//       courseLoading: !!action.payload,
//     }),

//     // Select course for loading into the course creation state
//     // Course template (e.g. from scratch) or an existing course (when it is fetched from the server)
//     // ({ courseId?: string, UUIDs: string[] }) => void
//     [selectCourseForEditing as any]: (state: any = {}, action: any) => {
//       const { courseId, UUIDs } = action.payload

//       const courseExists = compose(not, isNil, prop(courseId), prop('allCourses'))(state)
//       const defaultMarkIds = state.defaultMarkIds

//       const selectedCourse: SelectedCourseState = courseExists
//         ? state.allCourses[courseId]
//         : {
//             waypoints: [
//               {
//                 passingInstruction: PassingInstruction.Gate,
//                 id: UUIDs[0],
//                 controlPoint: {
//                   class: ControlPointClass.MarkPair,
//                   id: UUIDs[1],
//                   leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
//                   rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
//                   longName: 'Start',
//                   shortName: 'S',
//                 },
//               },
//               {
//                 passingInstruction: PassingInstruction.Gate,
//                 id: UUIDs[2],
//                 controlPoint: {
//                   class: ControlPointClass.MarkPair,
//                   id: UUIDs[3],
//                   leftMark: defaultMarkIds[DefaultMark.StartFinishPin],
//                   rightMark: defaultMarkIds[DefaultMark.StartFinishBoat],
//                   longName: 'Finish',
//                   shortName: 'F',
//                 },
//               },
//             ],
//           }

//       return {
//         ...state,
//         selectedCourse,
//         selectedWaypoint: selectedCourse.waypoints[0].id,
//         sameStartFinish: SAME_START_FINISH_DEFAULT,
//         selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
//       }
//     },

//     [addWaypoint as any]: (state: any = {}, action: any) => ({
//       ...state,
//       selectedCourse: {
//         ...state.selectedCourse,
//         waypoints: insertItem(
//           state.selectedCourse.waypoints,
//           action.payload.index,
//           { id: action.payload.UUID },
//         ),
//       },
//       selectedWaypoint: action.payload.UUID,
//       selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
//     }),

//     [saveWaypoint as any]: (state: any = {}, action: any) => {
//       const {
//         marks,
//         passingInstruction,
//         markPairLongName,
//       }: {
//         marks: Mark[]
//         passingInstruction: PassingInstruction
//         markPairLongName?: string
//       } = action.payload

//       const selectedWaypoint: WaypointState | undefined = getSelectedWaypoint(state)

//       if (!selectedWaypoint) return state

//       const controlPoint = selectedWaypoint.controlPoint

//       if (
//         (controlPoint.class === ControlPointClass.Mark && marks.length < 1) ||
//         (controlPoint.class === ControlPointClass.MarkPair && marks.length < 2)
//       ) return state

//       const leftMarkId = compose(prop('id'), head)
//       const rightMarkId = compose(prop('id'), tail)

//       const changedControlPoint = {
//         ...controlPoint,
//         ...(controlPoint.class === ControlPointClass.Mark
//           ? { id: leftMarkId(marks) }
//           : {
//             leftMark: leftMarkId(marks),
//             rightMark: rightMarkId(marks),
//             longName: markPairLongName || controlPoint.longName,
//           }
//         )
//       }

//       const changedWaypoint = {
//         ...selectedWaypoint,
//         passingInstruction,
//         controlPoint: changedControlPoint,
//       }

//       const marksToSave = controlPoint.class === ControlPointClass.Mark ?
//         take(marks, 1) : take(marks, 2)

//       return {
//         ...state,
//         ...updateSelectedWaypointReducer(state, changedWaypoint),
//         marks: {
//           ...state.marks,
//           ...keyBy(marksToSave, 'id'),
//         }
//       }
//     },

//     // Change selectedWaypoint
//     // (selectedWaypoint: string) => void
//     [selectWaypoint as any]: (state: any = {}, action: any) => ({
//       ...state,
//       selectedWaypoint: action.payload,
//       selectedGateSide: SELECTED_GATE_SIDE_DEFAULT,
//     }),

//     // Change selectedGateSide
//     // (selectedGateSide: GateSide) => void
//     [selectGateSide as any]: (state: any = {}, action: any) => ({
//       ...state,
//       selectedGateSide: action.payload,
//     }),

//     [removeUserData as any]: () => initialState,
//   },
//   initialState,
// )

//export default reducer
