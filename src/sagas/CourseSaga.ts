import { first, get } from 'lodash'
import { compose, flatten, map, prop, objOf, __, pick, reject, isNil,
  merge, uniqBy, find, propEq, dissoc, evolve, indexBy, values, uniq } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import uuidv4 from 'uuid/v4'

import { dataApi } from 'api'

import { navigateBack } from 'navigation'

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
    values)(
    apiMark)

  yield put(loadMark({ [id]: mark }))

  return id
}

function* apiControlPointToLocalFormat(controlPoint: any) {
  if (controlPoint.left) {
    const leftMark = yield call(
      fetchMark,
      controlPoint.left.id,
    )
    const rightMark = yield call(
      fetchMark,
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
      fetchMark, controlPoint.id,
    ),
  } as MarkState
}

// function* apiWaypointToLocalFormat(apiWaypoint: any) {
//   const controlPoint = yield call(
//     apiControlPointToLocalFormat, apiWaypoint.controlPoint)

//   return {
//     controlPoint,
//     id: uuidv4(),
//     passingInstruction: apiWaypoint.passingInstruction,
//   } as WaypointState
// }

function* apiCourseToLocalFormat(apiCourse: any) {
  const configurationsById = indexBy(prop('id'), apiCourse.markConfigurations)

  const waypoints = compose(
    map((waypoint: any) => ({
      passingInstruction: waypoint.passingInstruction,
      id: uuidv4(),
      controlPoint: waypoint.markConfigurationIds.length > 1 ?
        {
          leftMark: waypoint.markConfigurationIds[0],
          rightMark: waypoint.markConfigurationIds[1],
          longName: waypoint.controlPointName,
          shortName: waypoint.controlPointShortName,
          class: ControlPointClass.MarkPair,
        } :
        {
          class: ControlPointClass.Mark,
          id: waypoint.markConfigurationIds[0]
        }
    })),
    map(evolve({
      markConfigurationIds: map(compose(prop('markId'), prop(__, configurationsById)))
    })))(
    apiCourse.waypoints)

  const marksToLoad = compose(
    uniq,
    reject(isNil),
    flatten,
    map(compose(values, pick(['id', 'leftMark', 'rightMark']), prop('controlPoint'))))(
    waypoints)

  yield all(marksToLoad.map(id => call(fetchMark, id)))

  const course = {
    name: apiCourse.name,
    waypoints
  }

  return course
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
  //yield put(selectCourseForEditing(null))

  const { newCourse, raceName } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield put(selectRace(raceName))

  const raceId = getRaceId(regattaName, raceName)
  if (!newCourse) {
    yield call(fetchCourse, raceName)
  }

  yield put(selectCourseForEditing(raceId))
  yield put(updateCourseLoading(false))
}

// const bindMarkLocationOnServer = async (mark: Mark, selectedRaceInfo: SelectedRaceInfo) => {
//   const location = mark.location
//   const api = dataApi(selectedRaceInfo.serverUrl)

//   if (!location) return

//   if (location.positionType === MarkPositionType.TrackingDevice) {
//     await api.startDeviceMapping(selectedRaceInfo.leaderboardName, {
//       markId: mark.id,
//       deviceUuid: location.deviceUuid,
//       fromMillis: Date.now().toString(),
//       ...(selectedRaceInfo.secret ? { secret: selectedRaceInfo.secret } : {}),
//     })
//   } else {
//     await api.addMarkFix({
//       leaderboardName: selectedRaceInfo.leaderboardName,
//       raceColumnName: selectedRaceInfo.raceColumnName,
//       fleetName: selectedRaceInfo.fleet,
//       markId: mark.id,
//       lonDeg: location.longitude.toString(),
//       latDeg: location.latitude.toString(),
//       timeMillis: Date.now().toString(),
//     })
//   }
// }

// function* saveMarkToServer(mark: Mark) {
//   const selectedRaceInfo: SelectedRaceInfo = yield select(getSelectedRaceInfo)
//   const api = dataApi(selectedRaceInfo.serverUrl)
//   const response = yield call(
//     api.addMarkToRegatta,
//     selectedRaceInfo.regattaName,
//     mark.longName,
//     mark.shortName
//   )

//   if (!response || !response.markId) {
//     console.log({ response })
//     throw new Error('Failed to create mark on the server')
//   }

//   const { markId } = response
//   const markWithServerId: Mark = {
//     ...mark,
//     id: markId,
//   }
//   //   TODO: This is the code that saves the mark id for the server/regatta.
//   //   This has to be changed according to the way we will handle markIds
//   // dispatch(loadMark({ [markWithServerId.id]: mark }))

//   //   Right now we could also do CHANGE_MARK
//   //   to replace existing mark with new mark with server id,
//   //   and change mark ID in selectedCourse

//   yield call(bindMarkLocationOnServer, markWithServerId, selectedRaceInfo)
//   return markId
// }

// Convert waypoint to apiControlPoint and add mark to regatta if missing
function* waypointToApiControlPoint(waypoint: WaypointState) {
  // TODO: Add a check if mark is in regatta instead of dumbly always
  // adding the mark in the regatta even if it's there
  const { passingInstruction, controlPoint } = waypoint
  const marks = yield select(getMarks)
  return {
    passingInstruction,
    controlPointName: controlPoint.longName,
    controlPointShortName: controlPoint.shortName,
    marks:
      controlPoint.class === ControlPointClass.Mark
        ? [marks[controlPoint.id].id]
        : [marks[controlPoint.leftMark as string].id,
           marks[controlPoint.rightMark as string].id,
          ],
  }
}

function* saveCourseFlow() {
  const { serverUrl, regattaName, raceColumnName, fleet } = yield select(getSelectedRaceInfo)
  const api = dataApi(serverUrl)
  // TODO: There should be a validation step here to see that the object
  // is actually CourseState, i.e. without Partial information
  const selectedCourseState: CourseState = yield select(getSelectedCourseState)

  const apiControlPoints = yield all(selectedCourseState.waypoints.map(
    waypoint => call(waypointToApiControlPoint, waypoint),
  ))

  const marks = yield select(getMarks)

  const addFreestyleAndPositioning = ({ markId }: any) => {
    const mark = marks[markId]
    const markPosition = mark.position || mark.location

    return {
      markId,
      freestyleProperties: {
        name: mark.longName,
        shortName: mark.shortName,
        markType: mark.type
      },

      positioning: markPosition && (markPosition.positionType === MarkPositionType.Geolocation ?
        { position: { latitude_deg: markPosition.latitude, longitude_deg: markPosition.longitude } } :
        { deviceUUID: 'test' })
    }
  }

  const markConfigurations = compose(
    map(m => merge(m, { id: uuidv4() })),
    uniqBy(prop('markId')),
    map(merge({ storeToInventory: true })),
    map(addFreestyleAndPositioning),
    map(objOf('markId')),
    flatten,
    map(prop('marks')))(
    apiControlPoints)

  const markConfigurationIdByMarkId = (markId: string) => compose(
    prop('id'),
    find(propEq('markId', markId)))(
    markConfigurations)

  const waypoints = compose(
    map(dissoc('marks')),
    map((waypoint: any) => ({
      ...waypoint,
      markConfigurationIds: map(markConfigurationIdByMarkId, waypoint.marks)
    })))(
    apiControlPoints)

  yield call(api.createCourse, regattaName, raceColumnName, fleet, {
    // Todo: leave markId and remove freestyleProps if the configuration
    // is based on a mark from inventory
    markConfigurations: markConfigurations.map(dissoc('markId')),
    waypoints
  })

  const courseID = getRaceId(regattaName, raceColumnName)
  yield put(loadCourse({ [courseID]: selectedCourseState }))

  navigateBack()
}


export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
  ])
}
