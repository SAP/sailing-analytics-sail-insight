import { createAction } from 'redux-actions'

export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const updateTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')
export const updateTrackingStatistics = createAction('UPDATE_TRACKING_STATISTICS')
export const resetTrackingStatistics = createAction('RESET_TRACKING_STATISTICS')
export const updateStartedAt = createAction('UPDATE_STARTED_AT')
export const updateLastWindCourse = createAction('UPDATE_WIND_COURSE')
export const updateLastWindSpeed = createAction('UPDATE_WIND_SPEED')
export const updateTrackingStartTimeUpdateFlag = createAction('UPDATE_TRACKING_START_TIME_UPDATED_FLAG')
export const updateStartAutoCourseStatus = createAction('UPDATE_START_AUTO_COURSE_STATUS')
