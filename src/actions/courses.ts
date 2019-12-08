import { createAction } from 'redux-actions'

export const SELECT_COURSE = 'SELECT_COURSE'
export const SELECT_COURSE_FOR_RACE = 'SELECT_COURSE_FOR_RACE'
export const SAVE_COURSE = 'SAVE_COURSE'
export const SELECT_WAYPOINT = 'SELECT_WAYPOINT'
export const SELECT_MARK_CONFIGURATION = 'SELECT_MARK_CONFIGURATION'

export const loadCourse = createAction('LOAD_COURSE')
export const selectCourse = createAction(SELECT_COURSE)
export const editCourse = createAction('EDIT_COURSE')
export const selectMarkConfiguration = createAction(SELECT_MARK_CONFIGURATION)
export const saveCourse = createAction(SAVE_COURSE)
export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

export const addWaypoint = createAction('ADD_WAYPOINT')
export const selectWaypoint = createAction(SELECT_WAYPOINT)
export const saveWaypoint = createAction('SAVE_WAYPOINT')
export const removeWaypoint = createAction('REMOVE_WAYPOINT')
export const toggleSameStartFinish = createAction('TOGGLE_SAME_START_FINISH')
