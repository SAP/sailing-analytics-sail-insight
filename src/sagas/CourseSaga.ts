import { first, get, values } from 'lodash'
import { compose } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import uuidv4 from 'uuid/v4'

import { dataApi } from 'api'

import {
  loadCourse,
  loadMark,
  loadMarkPair,
  SAVE_COURSE,
  SELECT_COURSE,
  selectCourseForEditing,
  updateCourseLoading,
} from 'actions/courses'
import {
  selectRace
} from 'actions/events'
import {
  ControlPointClass,
  CourseState,
  Geolocation,
  Mark,
  MarkID,
  MarkPairState,
  MarkPositionType,
  MarkState,
  WaypointState,
} from 'models/Course'
import {
  SelectedRaceInfo
} from 'models/Event'

import {
  getServerUrlSetting
} from 'selectors/settings'

import {
  getMarks,
  getSelectedCourseState,
  markByIdPresent,
} from 'selectors/course'

import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'

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

function* fetchMark(markId: string) {

  // TODO: Replace with selected data
  const { leaderboardName, serverURL } = yield select(getSelectedEventInfo)

  const api = dataApi(serverURL)
  const res = yield call(api.requestMark, leaderboardName, markId)
  const apiMark = get(res, 'entities.mark')

  if (!apiMark) {
    // Handle somehow
    const message = `Bad mark data received for leaderboard:${leaderboardName}  markId:${markId}`
    console.log(message)
    throw new Error(message)
  }

  const { mark, id } = compose(
    apiMarkToLocalFormat,
    first,
    values,
  )(apiMark)

  yield put(loadMark({ [id]: mark }))

  return id
}

function* fetchMissingMarkInformationIfNeeded(markId: string) {
  const markPresent = yield select(markByIdPresent(markId))
  if (!markPresent) {
    return yield call(fetchMark, markId)
  }
  // TODO: return the local id instead of the api id
  // TODO: Maybe update the mark location if the mark exists
  return markId
}

function* apiControlPointToLocalFormat(controlPoint: any) {
  if (controlPoint.left) {
    const leftMark = yield call(
      fetchMissingMarkInformationIfNeeded,
      controlPoint.left.id,
    )
    const rightMark = yield call(
      fetchMissingMarkInformationIfNeeded,
      controlPoint.right.id,
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
    yield put(loadMarkPair({ [markPairState.id]: markPairState }))

    // Maybe waypointState has to be changed overall to have the controlPoint
    // as just an id so that it can get information, such as longName, for
    // markPairs from the markPairs state

    return markPairState
  }

  return {
    class: ControlPointClass.Mark,
    id: yield call(
      fetchMissingMarkInformationIfNeeded, controlPoint.id,
    ),
  } as MarkState
}

function* apiWaypointToLocalFormat(apiWaypoint: any) {
  const controlPoint = yield call(
    apiControlPointToLocalFormat, apiWaypoint.controlPoint,
  )
  return {
    controlPoint,
    id: uuidv4(),
    passingInstruction: apiWaypoint.passingInstruction,
  } as WaypointState
}

function* apiCourseToLocalFormat(apiCourse: any) {
  const course: CourseState = {
    name: apiCourse.name,
    waypoints: yield all(
      apiCourse.waypoints.map((apiWaypoint: any) => call(apiWaypointToLocalFormat, apiWaypoint)),
    ),
  }

  return course
}

function* fetchMarkProperties() {
  const api = dataApi(getServerUrlSetting())
  const marks = yield call(api.requestMarkProperties)

  console.log('inventory marks', marks)
}

function* fetchCourse(raceName: string) {
  yield put(updateCourseLoading(true))

  const { regattaName, serverUrl, raceColumnName, fleet } = yield select(getSelectedRaceInfo)

  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, raceName)
  const apiCourse = yield call(api.requestCourse, regattaName, raceColumnName, fleet)
  const course: CourseState  = yield call(apiCourseToLocalFormat, apiCourse)

  yield put(loadCourse({
    [raceId]: course,
  }))
}

function* selectCourseFlow({ payload }: any) {
  const { newCourse, raceName } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield fetchMarkProperties()
  yield put(selectRace(raceName))

  const raceId = getRaceId(regattaName, raceName)
  if (!newCourse) {
    yield call(fetchCourse, raceName)
  }
  yield put(selectCourseForEditing(raceId))
  yield put(updateCourseLoading(false))
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

function* saveMarkToServer(mark: Mark) {
  const selectedRaceInfo: SelectedRaceInfo = yield select(getSelectedRaceInfo)
  const api = dataApi(selectedRaceInfo.serverUrl)
  const response = yield call(
    api.addMarkToRegatta,
    selectedRaceInfo.regattaName,
    mark.longName,
  )

  if (!response || !response.markId) {
    console.log({ response })
    throw new Error('Failed to create mark on the server')
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

  yield call(bindMarkLocationOnServer, markWithServerId, selectedRaceInfo)
  return markId
}

// Convert waypoint to apiControlPoint and add mark to regatta if missing
function* waypointToApiControlPoint(waypoint: WaypointState) {
  // TODO: Add a check if mark is in regatta instead of dumbly always
  // adding the mark in the regatta even if it's there
  const { passingInstruction, controlPoint } = waypoint
  const marks = yield select(getMarks)
  return {
    passingInstruction,
    marks:
      controlPoint.class === ControlPointClass.Mark
        ? [yield call(saveMarkToServer, marks[controlPoint.id])]
        : [
            // The `as string` should not be necessary and be taken care of by the typing
            yield call(saveMarkToServer, marks[controlPoint.leftMark as string]),
            yield call(saveMarkToServer, marks[controlPoint.rightMark as string]),
          ],
  }
}

function* saveCourseFlow() {
  const selectedRaceInfo: SelectedRaceInfo = yield select(getSelectedRaceInfo)
  const api = dataApi(selectedRaceInfo.serverUrl)
  // TODO: There should be a validation step here to see that the object
  // is actually CourseState, i.e. without Partial information
  const selectedCourseState: CourseState = yield select(getSelectedCourseState)

  const apiControlPoints = yield all(selectedCourseState.waypoints.map(
    waypoint => call(waypointToApiControlPoint, waypoint),
  ))

  yield call(api.addCourseDefinitionToRaceLog, {
    leaderboardName: selectedRaceInfo.leaderboardName,
    raceColumnName: selectedRaceInfo.raceColumnName,
    fleetName: selectedRaceInfo.fleet,
    controlPoints: apiControlPoints,
  })

  const courseID = getRaceId(selectedRaceInfo.regattaName, selectedRaceInfo.raceColumnName)
  yield put(loadCourse({ [courseID]: selectedCourseState }))
}


export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
  ])
}
