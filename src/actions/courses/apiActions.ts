import { first, get, values } from 'lodash'
import { compose } from 'ramda'
import uuidv4 from 'uuid/v4'

import { dataApi } from 'api'
import { DispatchType, GetStateType } from 'helpers/types'

import {
  loadCourse,
  loadMark,
  loadMarkPair,
  selectCourse,
  updateCourseLoading,
} from 'actions/courses'
import {
  ControlPointClass,
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
import {
  getMarks,
  getSelectedCourseState,
  getSelectedRaceInfo,
  markByIdPresent,
} from 'selectors/course'


const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

const getNowInMillis = () => Date.now() * 1000

const apiMarkToLocalFormat = (apiMark: any): { mark: Mark; id: MarkID } => {
  const mark: Mark = {
    id: apiMark.id,
    class: ControlPointClass.Mark,
    longName: apiMark.name,
    shortName: first(apiMark.name),
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

    const markPairState: MarkPairState =  {
      leftMark,
      rightMark,
      longName: controlPoint.name,
      shortName: first(controlPoint.name),
      class: ControlPointClass.MarkPair,
      id: controlPoint.id,
    }

    // Maybe need a check like `if(markPairByIdPresent())`
    dispatch(loadMarkPair({ [markPairState.id]: markPairState }))

    // Maybe waypointState has to be changed overall to have the controlPoint
    // as just an id so that it can get information, such as longName, for
    // markPairs from the markPairs state

    return markPairState
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

const saveMarkToServer = (mark: Mark) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const selectedRaceInfo = getSelectedRaceInfo(getState()) as SelectedRaceInfo
  const api = dataApi(selectedRaceInfo.serverUrl)
  const response = await api.addMarkToRegatta(
    selectedRaceInfo.regattaName,
    mark.longName,
  )

  if (!response || !response.markId) {
    console.log({ response })
    throw Error('Failed to create mark on the server')
  }

  const { markId } = response
  const markWithServerId: Mark = {
    ...mark,
    id: markId,
  }
  //   TODO: This is the code that saves the mark id for the server/regatta.
  //   This has to be changed according to the way we will handle markIds
  // dispatch(loadMark({ [markWithServerId.id]: mark }))

  //   Right now we could also do CHANGE_MARK
  //   to replace existing mark with new mark with server id,
  //   and change mark ID in selectedCourse

  await bindMarkLocationOnServer(markWithServerId, selectedRaceInfo)
  return markId
}

// Convert waypoint to apiControlPoint and add mark to regatta if missing
const waypointToApiControlPoint = (waypoint: WaypointState) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  // TODO: Add a check if mark is in regatta instead of dumbly always
  // adding the mark in the regatta even if it's there
  const { passingInstruction, controlPoint } = waypoint
  const marks = getMarks(getState())
  return {
    passingInstruction,
    marks:
      controlPoint.class === ControlPointClass.Mark
        ? [await dispatch(saveMarkToServer(marks[controlPoint.id]))]
        : [
            // The `as string` should not be necessary and be taken care of by the typing
            await dispatch(saveMarkToServer(marks[controlPoint.leftMark as string])),
            await dispatch(saveMarkToServer(marks[controlPoint.rightMark as string])),
          ],
  }
}

export const saveCourse = () => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const selectedRaceInfo = getSelectedRaceInfo(getState()) as SelectedRaceInfo
  const api = dataApi(selectedRaceInfo.serverUrl)
  // TODO: There should be a validation step here to see that the object
  // is actually CourseState, i.e. without Partial information
  const selectedCourseState = getSelectedCourseState(getState()) as CourseState

  const apiControlPoints = await Promise.all(selectedCourseState.waypoints.map(
    async waypoint => await dispatch(waypointToApiControlPoint(waypoint))
  ))

  await api.addCourseDefinitionToRaceLog({
    leaderboardName: selectedRaceInfo.leaderboardName,
    raceColumnName: selectedRaceInfo.raceColumnName,
    fleetName: selectedRaceInfo.fleet,
    controlPoints: apiControlPoints,
  })

  const courseID = getRaceId(selectedRaceInfo.regattaName, selectedRaceInfo.raceColumnName)
  dispatch(loadCourse({ [courseID]: selectedCourseState }))
}

