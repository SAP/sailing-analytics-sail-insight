import { compose, curry, objOf, times } from 'ramda'
import { createAction } from 'redux-actions'
import uuidv4 from 'uuid/v4'

const addUUIDs = curry((amount: number, payload: any) => ({
  ...(amount > 1 ? { UUIDs: times(uuidv4, amount) } : { UUID: uuidv4() }),
  ...payload,
}))

const addUUID = addUUIDs(1)


export const SELECT_COURSE = 'SELECT_COURSE'
export const SAVE_COURSE = 'SAVE_COURSE'

export const saveCourse = createAction(SAVE_COURSE)

// Actions to store the appropriate objects as they are into the state
export const loadCourse = createAction('LOAD_COURSE')
export const loadMark = createAction('LOAD_MARK')
export const loadMarkPair = createAction('LOAD_MARK_PAIR')

export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

export const selectCourse = createAction(SELECT_COURSE)

// TODO: the addUUIDs(4) should be replaced with an actual number of
//       required UUIDs for a given template, besides the start from scratch
export const selectCourseForEditing = createAction(
  'SELECT_COURSE_FOR_EDITING',
  compose(
    addUUIDs(4),
    objOf('courseId'),
  ),
)

export const addWaypoint = createAction(
  'ADD_WAYPOINT',
  compose(
    addUUID,
    objOf('index'),
  ),
)

export const saveWaypoint = createAction('SAVE_WAYPOINT')
export const removeWaypoint = createAction('REMOVE_WAYPOINT')
export const updateControlPoint = createAction('UPDATE_CONTROL_POINT')

export const selectWaypoint = createAction('SELECT_WAYPOINT')
export const selectGateSide = createAction('SELECT_GATE_SIDE')
export const toggleSameStartFinish = createAction('TOGGLE_SAME_START_FINISH')
