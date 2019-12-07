import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'

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

import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'

const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

function* fetchCourse(raceName: string) {
  yield put(updateCourseLoading(true))

  const { regattaName, serverUrl, raceColumnName, fleet } = yield select(getSelectedRaceInfo)

  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, raceName)
  const apiCourse = yield call(api.requestCourse, regattaName, raceColumnName, fleet)

  console.log('loaded course from server', apiCourse)

  yield put(loadCourse({
    [raceId]: apiCourse,
  }))
}

function* selectRaceCourseFlow({ payload }: any) {
  const { newCourse, raceName } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield put(selectRace(raceName))

  const raceId = getRaceId(regattaName, raceName)
  if (!newCourse) {
    yield call(fetchCourse, raceName)
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
