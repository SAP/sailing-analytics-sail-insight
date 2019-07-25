import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType } from 'helpers/types'

export const receiveCourse = createAction('RECEIVE_COURSE')
export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

export const fetchCourse = (regattaName: string, raceName: string) =>
  async (dispatch: DispatchType) => {
    // TODO: Inject serverURL
    const api = selfTrackingApi('https://sapsailing.com')
    const raceId = getRaceId(regattaName, raceName)
    dispatch(updateCourseLoading(true))
    const course = {
      [raceId]: await api.requestCourse(regattaName, raceName)
    }
    dispatch(receiveCourse(course))
    dispatch(updateCourseLoading(false))
    return course
  }
