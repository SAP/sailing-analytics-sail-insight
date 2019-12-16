import { createAction } from 'redux-actions'

export const SELECT_COURSE = 'SELECT_COURSE'
export const SELECT_COURSE_FOR_RACE = 'SELECT_COURSE_FOR_RACE'
export const SAVE_COURSE = 'SAVE_COURSE'
export const SELECT_WAYPOINT = 'SELECT_WAYPOINT'
export const SELECT_MARK_CONFIGURATION = 'SELECT_MARK_CONFIGURATION'
export const TOGGLE_SAME_START_FINISH = 'TOGGLE_SAME_START_FINISH'

export const loadCourse = createAction('LOAD_COURSE')
export const selectCourse = createAction(SELECT_COURSE)
export const editCourse = createAction('EDIT_COURSE')
export const selectMarkConfiguration = createAction(SELECT_MARK_CONFIGURATION)
export const saveCourse = createAction(SAVE_COURSE)
export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

export const updateWaypointName = createAction('UPDATE_WAYPOINT_NAME')
export const updateWaypointShortName = createAction('UPDATE_WAYPOINT_SHORT_NAME')
export const updateWaypointPassingInstruction = createAction('UPDATE_WAYPOINT_PASSING_INSTRUCTION')
export const updateMarkConfigurationName = createAction('UPDATE_MARK_NAME')
export const updateMarkConfigurationShortName = createAction('UPDATE_MARK_SHORT_NAME')
export const updateMarkConfigurationLocation = createAction('UPDATE_MARK_LOCATION')

export const changeWaypointToNewMark = createAction('CHANGE_WAYPOINT_TO_NEW_MARK')
export const changeWaypointToNewLine = createAction('CHANGE_WAYPOINT_TO_NEW_LINE')
export const changeWaypointMarkConfigurationToNew = createAction('CHANGE_WAYPOINT_MARK_CONFIGURATION_TO_NEW')
export const assignMarkPropertiesToMarkConfiguration = createAction('ASSIGN_MARK_PROPERTIES_TO_MARK_CONFIGURATION')
export const replaceWaypointMarkConfiguration = createAction('REPLACE_MARK_CONFIGURATION')

export const addWaypoint = createAction('ADD_WAYPOINT')
export const selectWaypoint = createAction(SELECT_WAYPOINT)
export const saveWaypoint = createAction('SAVE_WAYPOINT')
export const removeWaypoint = createAction('REMOVE_WAYPOINT')
export const toggleSameStartFinish = createAction(TOGGLE_SAME_START_FINISH)
