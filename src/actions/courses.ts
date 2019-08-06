import { first, get, keys, values } from 'lodash'
import { compose, curry, objOf, times } from 'ramda'
import { createAction } from 'redux-actions'
import uuidv4 from 'uuid/v4'

import { dataApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'

import {
  ControlPoint,
  ControlPointClass,
  ControlPointState,
  CourseState,
  Geolocation,
  Mark,
  MarkID,
  MarkPairState,
  MarkPositionType,
  MarkState,
  SelectedRaceInfo,
  WaypointState,
} from 'models/Course'
import { markByIdPresent, getSelectedRaceInfo } from 'selectors/course'

const getNowInMillis = () => Date.now() * 1000

const addUUIDs = curry((amount: number, payload: any) => ({
  ...(amount > 1 ? { UUIDs: times(uuidv4, amount) } : { UUID: uuidv4() }),
  ...payload,
}))

const addUUID = addUUIDs(1)

// Actions to store the appropriate objects as they are into the state
export const loadCourse = createAction('LOAD_COURSE')
export const loadMark = createAction('LOAD_MARK')

export const updateCourseLoading = createAction('UPDATE_COURSE_LOADING')

// TODO: the addUUIDs(4) should be replaced with an actual number of
//       required UUIDs for a given template, besides the start from scratch
export const selectCourse = createAction(
  'SELECT_COURSE',
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
export const removeWaypoint = createAction('REMOVE_WAYPOINT')
export const updateWaypoint = createAction('UPDATE_WAYPOINT')
export const updateControlPoint = createAction('UPDATE_CONTROL_POINT')

export const selectEvent = createAction('SELECT_EVENT')
export const selectRace = createAction('SELECT_RACE')
export const selectWaypoint = createAction('SELECT_WAYPOINT')
export const selectGateSide = createAction('SELECT_GATE_SIDE')
export const toggleSameStartFinish = createAction('TOGGLE_SAME_START_FINISH')

const apiMarkToLocalFormat = (apiMark: any): { mark: Mark; id: MarkID } => {
  const mark: Mark = {
    id: apiMark.id,
    class: ControlPointClass.Mark,
    longName: apiMark.name,
    type: apiMark.type,
    position:
      apiMark.position &&
      ({
        positionType: MarkPositionType.Geolocation,
        latitude: apiMark.position.latitude,
        longitude: apiMark.position.longitude,
      } as Geolocation),
  }
  const id = mark.id

  return { mark, id }
}

const fetchMark = (leaderboardName: string, markId: string) => async (
  dispatch: DispatchType,
) => {
  const api = dataApi('https://sapsailing.com')
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
  const markPresent = markByIdPresent(markId)(getState())
  if (!markPresent) {
    return await dispatch(fetchMark(leaderboardName, markId))
  }
  // TODO: return the local id instead of the api id
  // TODO: Maybe update the mark location if the mark exists
  return markId
}

const apiControlPointToLocalFormat = (
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
      class: ControlPointClass.MarkPair,
      id: controlPoint.id,
      leftMark,
      rightMark,
    } as MarkPairState
  }

  return {
    class: ControlPointClass.Mark,
    id: await dispatch(
      fetchMissingMarkInformationIfNeeded(leaderboardName, controlPoint.id),
    ),
  } as MarkState
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
          const controlPoint = await dispatch(
            apiControlPointToLocalFormat(
              leaderboardName,
              apiWaypoint.controlPoint,
            ),
          )
          return {
            controlPoint,
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
  const api = dataApi('https://sapsailing.com')
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

export const assignControlPointClass = (controlPointClass: ControlPointClass) =>
  updateControlPoint({
    class: controlPointClass,
    id: controlPointClass === ControlPointClass.MarkPair ? uuidv4() : undefined,
  })

const assignControlPointState = (controlPoint: ControlPointState) =>
  updateControlPoint(controlPoint)

const controlPointToControlPointState = (
  controlPoint: ControlPoint,
): ControlPointState => ({
  id: controlPoint.id,
  ...(controlPoint.class === ControlPointClass.Mark
    ? { class: controlPoint.class }
    : {
        class: controlPoint.class,
        leftMark: controlPoint.leftMark && controlPoint.leftMark.id,
        rightMark: controlPoint.rightMark && controlPoint.rightMark.id,
      }),
})

export const assignControlPoint = (controlPoint: ControlPoint) => compose(
  assignControlPointState,
  controlPointToControlPointState,
)(controlPoint)

const bindMarkLocationOnServer = async (mark: Mark, selectedRaceInfo: SelectedRaceInfo) => {
  const position = mark.position
  const api = dataApi(selectedRaceInfo.serverUrl)
  if (!position) return

  if (position.positionType === MarkPositionType.TrackingDevice) {
    await api.startDeviceMapping(selectedRaceInfo.leaderboardName, {
      markId: mark.id,
      deviceUuid: position.deviceUuid,
      fromMillis: getNowInMillis(),
      ...(selectedRaceInfo.secret ? { secret: selectedRaceInfo.secret } : {}),
    })
  } else {
    await api.addMarkFix({
      leaderboardName: selectedRaceInfo.leaderboardName,
      raceColumnName: selectedRaceInfo.raceColumnName,
      fleetName: selectedRaceInfo.fleet,
      markId: mark.id,
      lonDeg: position.longitude.toString(),
      latDeg: position.latitude.toString(),
      timeMillis: getNowInMillis().toString(),
    })
  }
}

export const saveMark = (mark: Mark) =>
  async (dispatch: DispatchType, getState : GetStateType) => {
    const selectedRaceInfo = getSelectedRaceInfo(getState()) as SelectedRaceInfo
    const api = dataApi(selectedRaceInfo.serverUrl)
    const response = await api.addMarkToRegatta(selectedRaceInfo.regattaName, mark.longName)

    if (!response || !response.markId) {
      console.log({ response })
      throw Error('Failed to create mark on the server')
    }

    const { markId } = response
    const markWithServerId: Mark = {
      ...mark,
      id: markId
    }
    dispatch(loadMark({ [markWithServerId.id]: mark }))
    await bindMarkLocationOnServer(markWithServerId, selectedRaceInfo)
  }
