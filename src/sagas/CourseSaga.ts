import { map, evolve, merge } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import uuidv4 from 'uuid/v4'

import {
  loadCourse,
  SAVE_COURSE,
  SELECT_COURSE_FOR_RACE,
  selectCourse,
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

function* selectRaceCourseFlow({ payload }: any) {
  const { race } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield put(selectRace(race))

  const raceId = getRaceId(regattaName, race)
  const course = yield select(getCourseById(raceId))

  if (course) {
    yield call(fetchCourse, race)
  }

  yield put(selectCourse(raceId))
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
    takeLatest(SELECT_COURSE_FOR_RACE, selectRaceCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
  ])
}
