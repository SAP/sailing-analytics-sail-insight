import { handleActions } from 'redux-actions'

import { RaceState } from 'reducers/config'

import { removeUserData } from 'actions/auth'
import { receiveCourse, receiveMark, updateCourseLoading } from 'actions/races'


const initialState: RaceState = {
  allRaces: {},
  courses: {} as Map<string, any>,
  marks: {},
  courseLoading: false,
} as RaceState

const reducer = handleActions(
  {
    [receiveCourse as any]: (state: any = {}, action: any) => {
      const course = action && action.payload
      if (!course) {
        return state
      }

      return {
        ...state,
        courses: {
          ...state.courses,
          ...course,
        },
      }
    },
    [receiveMark as any]: (state: any = {}, action: any) => {
      const mark = action && action.payload
      if (!mark) {
        return state
      }

      return {
        ...state,
        marks: {
          ...state.marks,
          ...mark,
        },
      }
    },
    [updateCourseLoading as any]: (state: any = {}, action?: any) => {
      if (!action) {
        return state
      }

      return {
        ...state,
        courseLoading: !!action.payload,
      }
    },
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
