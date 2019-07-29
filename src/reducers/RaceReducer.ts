import { handleActions } from 'redux-actions'
import uuidv4 from 'uuid/v4'

import { RaceState } from 'reducers/config'

import { removeUserData } from 'actions/auth'
import {
  addWaypoint,
  updateWaypoint,
  loadCourse,
  loadMark,
  removeWaypoint,
  selectCourse,
  updateCourseLoading,
} from 'actions/races'
import { CourseCreationState, CourseState, Mark } from 'models/Course'

const insertItem = (array: any[], index: number, item: any) => {
	let newArray = array.slice()
	newArray.splice(index, 0, item)
	return newArray
}

const removeItem = (array: any[], index: number) => (
	array.filter((item: any, i: number) => i !== index)
)

const updateItem = (array: any[], index: number, item: any) => (
	array.map((it: any, ind: number) => {
		if (ind !== index) {
			return it
		}

		return item
	})
)

const generateUUID = () => uuidv4()

const initialState: RaceState = {
  allRaces: {},
  courses: {} as Map<string, CourseState>,
  marks: {} as Map<string, Mark>,
  courseLoading: false,
  courseCreation: undefined,
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
    // (courseID?: string) => void
    [selectCourse as any]: (state: any = {}, action: any) => {
      const courseID = action.payload
      const courseExists = courseID && Object.keys(state.courses).includes(courseID)
      if (courseExists) {
        return {
          ...state,
          courseCreation: state.courses[courseID],
        }
      }

			//TODO: UUID OUT!!
      const newCourse: CourseCreationState = {
        name: 'New course',
        waypoints: [
          {
            shortName: 'S',
            longName: 'Start',
            passingInstruction: 'Gate',
						id: generateUUID(),
          },
          {
            shortName: 'F',
            longName: 'Finish',
            passingInstruction: 'Gate',
						id: generateUUID(),
          },
        ],
      }

      return {
        ...state,
        courseCreation: newCourse,
      }
    },

    // Create a new waypoint at a specified index
    // (index: number) => void
    [addWaypoint as any]: (state: any = {}, action: any) => ({
			...state,
			courseCreation: {
				...state.courseCreation,
				// TODO: UUID
				// TODO: Set selectedWaypoint
				waypoints: insertItem(state.courseCreation.waypoints, action.payload, {}),
      },
    }),

    // Remove a new waypoint at a specified index
    // (index: number) => void
    [removeWaypoint as any]: (state: any = {}, action: any) => ({
			//TODO: use id from selectedWaypoint
      ...state,
      courseCreation: {
        ...state.courseCreation,
        waypoints: removeItem(state.courseCreation.waypoints, action.payload),
      },
    }),

    // Change waypoint state at a given index
    // ({ index, waypoint }: { number, Partial<Waypoint> }) => void
    [updateWaypoint as any]: (state: any = {}, action: any) => {
			// TODO: use index from selectedWaypoint
      const { index, waypoint } = action.payload

      return {
        ...state,
        courseCreation: {
          ...state.courseCreation,
          waypoints: updateItem(state.courseCreation.waypoints, index, waypoint),
        },
      }
    },

    [removeUserData as any]: () => initialState,

  },
  initialState,
)

export default reducer
