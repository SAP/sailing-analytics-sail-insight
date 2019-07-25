import { first, get, keys } from 'lodash'
import { createAction } from 'redux-actions'

import { selfTrackingApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'

import { CourseState, WaypointState } from 'models/Course'
import { markdByIdPresent } from 'selectors/race'

export const receiveRace = createAction('RECEIVE_RACE')
export const receiveCourse = createAction('RECEIVE_COURSE')
export const receiveMark = createAction('RECEIVE_MARK')

export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

const fetchMark = (leaderboardName: string, markId: string) => async (
  dispatch: DispatchType,
) => {
  const api = selfTrackingApi('https://sapsailing.com')
  const res = await api.requestMark(leaderboardName, markId)
  const apiMark = get(res, 'entities.mark')

  if (!apiMark) {
    // Handle somehow
    console.log(
      `Bad mark data received for leaderboard:${leaderboardName}  markId:${markId}`,
    )
  }

  // const { id, mark } = apiMarkToLocalState()
  const id = first(keys(apiMark))
  const mark = apiMark
  dispatch(receiveMark(mark))

  return id
}

const fetchMissingMarkInformationIfNeeded = (
  leaderboardName: string,
  markId: any,
) => async (dispatch: DispatchType, getState: GetStateType) => {
  const markPresent = markdByIdPresent(markId)(getState())
  if (!markPresent) {
    return await dispatch(fetchMark(leaderboardName, markId))
  }
  // TODO: return the local id instead of the api id
  // TODO: Maybe update the mark location if the mark exists
  return markId
}

const apiControlPointToLocalMarkIds = (
  leaderboardName: string,
  controlPoint: any,
) => async (dispatch: DispatchType) => {
  if (controlPoint.left) {
    const leftMarkId = await dispatch(
      fetchMissingMarkInformationIfNeeded(
        leaderboardName,
        controlPoint.left.id,
      ),
    )
    const rightMarkId = await dispatch(
      fetchMissingMarkInformationIfNeeded(
        leaderboardName,
        controlPoint.right.id,
      ),
    )

    return {
      leftMarkId,
      rightMarkId,
    }
  }

  return {
    leftMarkId: await dispatch(
      fetchMissingMarkInformationIfNeeded(leaderboardName, controlPoint.id),
    ),
    rightMarkId: undefined,
  }
}

const apiCourseToLocalFormat = (
  apiCourse: any,
  raceId: string,
  leaderboardName: string,
) => async (dispatch: DispatchType) => {
  // Can't get the types to work because of Promise.all
  // ) => async (dispatch: DispatchType): Promise<{ [id: string]: CourseState }> => {
  // const course: CourseState = {
  const course = {
    name: apiCourse.name,
    waypoints: await Promise.all(apiCourse.waypoints.map(async (waypoint: any): Promise<WaypointState> => {
      const { leftMarkId, rightMarkId } = await dispatch(
        apiControlPointToLocalMarkIds(leaderboardName, waypoint.controlPoint),
      ) as { leftMarkId: string, rightMarkId?: string }
      return {
        leftMarkId,
        rightMarkId,
        passingInstruction: waypoint.passingInstruction,
      }
    })),
  }

  return {
    [raceId]: course,
  }
}

const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

export const fetchCourse = (
  regattaName: string,
  raceName: string,
  leaderboardName: string,
) => async (dispatch: DispatchType) => {
  dispatch(updateCourseLoading(true))

  // TODO: Inject serverURL
  const api = selfTrackingApi('https://sapsailing.com')
  const raceId = getRaceId(regattaName, raceName)
  const apiCourse = await api.requestCourse(regattaName, raceName)
  const course: { [id: string]: CourseState } = await dispatch(
    apiCourseToLocalFormat(apiCourse, raceId, leaderboardName),
  )

  dispatch(receiveCourse(course))
  dispatch(updateCourseLoading(false))
  return course
}
