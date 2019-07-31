import { first, get, keys, values } from 'lodash'
import { compose, curry, objOf, times } from 'ramda'
import { createAction } from 'redux-actions'
import uuidv4 from 'uuid/v4'

import { selfTrackingApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'

import {
  CourseState,
  Geolocation,
  Mark,
  MarkID,
  WaypointState
} from "models/Course"
import { markdByIdPresent } from 'selectors/race'

const addUUIDs = curry((amount: number, payload: any) => ({
  ...(amount > 1 ?
    { UUIDs: times(uuidv4, amount) } :
    { UUID : uuidv4() }
  ),
  ...payload,
}))

const addUUID = addUUIDs(1)

// Actions to store the appropriate objects as they are into the state
export const loadRace = createAction('LOAD_RACE')
export const loadCourse = createAction('LOAD_COURSE')
export const loadMark = createAction('LOAD_MARK')

export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

// TODO: the addUUIDs(2) should be replaced with an actual number of
//       required UUIDs for a given template, besides the start from scratch
export const selectCourse = createAction('SELECT_COURSE', compose(
  addUUIDs(2),
  objOf('courseId'),
))

export const addWaypoint = createAction('ADD_WAYPOINT', compose(
  addUUID,
  objOf('index'),
))
export const removeWaypoint = createAction('REMOVE_WAYPOINT')
export const updateWaypoint = createAction('UPDATE_WAYPOINT')

// Save course to server
export const saveCourse = createAction('SAVE_COURSE')
// Save mark to server
export const saveMark = createAction('SAVE_MARK')

export const selectWaypoint = createAction('SELECT_WAYPOINT')
export const toggleSameStartFinish = createAction('TOGGLE_SAME_START_FINISH')

const apiMarkToLocalFormat = (apiMark: any): { mark: Mark, id: MarkID } => {
  const mark: Mark = {
    id: apiMark.id,
    longName: apiMark.name,
    type: apiMark.type,
    position: apiMark.position && {
      latitude: apiMark.position.latitude,
      longitude: apiMark.position.longitude,
    } as Geolocation,
  }
  const id = mark.id

  return { mark, id }
}

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

  const { mark, id } = compose(
    apiMarkToLocalFormat,
    first,
    values,
  )(apiMark)
  dispatch(loadMark({ [id]: mark }))

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
    const leftMark = await dispatch(
      fetchMissingMarkInformationIfNeeded(
        leaderboardName,
        controlPoint.left.id,
      ),
    )
    const rightMark = await dispatch(
      fetchMissingMarkInformationIfNeeded(
        leaderboardName,
        controlPoint.right.id,
      ),
    )

    return {
      leftMark,
      rightMark,
    }
  }

  return {
    leftMark: await dispatch(
      fetchMissingMarkInformationIfNeeded(leaderboardName, controlPoint.id),
    ),
    rightMark: undefined,
  }
}

const apiCourseToLocalFormat = (
  apiCourse: any,
  raceId: string,
  leaderboardName: string,
) => async (dispatch: DispatchType): Promise<{ [id: string]: CourseState }> => {
  const course: CourseState = {
    name: apiCourse.name,
    waypoints: await Promise.all<WaypointState>(
      apiCourse.waypoints.map(
        async (apiWaypoint: any): Promise<WaypointState> => {
          const { leftMark, rightMark } = (await dispatch(
            apiControlPointToLocalMarkIds(
              leaderboardName,
              apiWaypoint.controlPoint,
            ),
          )) as { leftMark: string; rightMark?: string }
          return {
            leftMark,
            rightMark,
            id: uuidv4(),
            longName: apiWaypoint.controlPoint.name,
            passingInstruction: apiWaypoint.passingInstruction,
          }
        },
      ),
    ),
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

  dispatch(loadCourse(course))
  dispatch(selectCourse(raceId))
  dispatch(updateCourseLoading(false))
  return course
}
