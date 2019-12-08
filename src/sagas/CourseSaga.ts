import { map, evolve, merge } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import uuidv4 from 'uuid/v4'

import {
  loadCourse,
  SAVE_COURSE,
  SELECT_COURSE,
  selectCourse,
  editCourse,
  updateCourseLoading,
} from 'actions/courses'
import {
  selectRace
} from 'actions/events'

import { getCourseById } from 'selectors/course'

import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'

const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

const newCourse = () => {
  const startBoatId = uuidv4()
  const startPinId = uuidv4()
  const windwardMarkId = uuidv4()

  return {
    markConfigurations: [
      {id: startBoatId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Boat', shortName: 'SFB' }},
      {id: startPinId, effectiveProperties: { markType: 'BUOY', name: 'Start/Finish Pin', shortName: 'SFP' }},
      {id: windwardMarkId, effectiveProperties: { markType: 'BUOY', name: 'Windward Mark', shortName: 'W' }}
    ],
    waypoints: [
      { id: uuidv4(), passingInstruction: 'Gate', markConfigurationIds: [startPinId, startBoatId], controlPointName: 'Start', controlPointShortName: 'S' },
      { id: uuidv4(), passingInstruction: 'Port', markConfigurationIds: [windwardMarkId] },
      { id: uuidv4(), passingInstruction: 'Gate', markConfigurationIds: [ startPinId, startBoatId], controlPointName: 'Finish', controlPointShortName: 'F' }]
  }
}

function* fetchCourse(race: string) {
  yield put(updateCourseLoading(true))

  const { regattaName, serverUrl, raceColumnName, fleet } = yield select(getSelectedRaceInfo)

  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, race)
  const course = yield call(api.requestCourse, regattaName, raceColumnName, fleet)

  const courseWithWaypointIds = evolve({
    waypoints: map(w => merge(w, { id: uuidv4() }))
  }, course)

  yield put(loadCourse({
    raceId,
    course: courseWithWaypointIds
  }))
}

function* selectCourseFlow({ payload }: any) {
  const { race } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield put(selectRace(race))

  const raceId = getRaceId(regattaName, race)
  const course = yield select(getCourseById(raceId))

  let editedCourse

  if (course) {
    yield call(fetchCourse, race)
    editedCourse = yield select(getCourseById(raceId))
  } else {
    editedCourse = newCourse()
  }

  yield put(editCourse(editedCourse))
  yield put(updateCourseLoading(false))
}

function* saveCourseFlow() {
  // yield call(api.createCourse, regattaName, raceColumnName, fleet, {
  //   markConfigurations: map(markIdOrFreestyleProps, markConfigurations),
  //   waypoints
  // })

  //const courseID = getRaceId(regattaName, raceColumnName)
  // yield put(loadCourse({ [courseID]: selectedCourseState }))

  //navigateBack()
}


export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
  ])
}
