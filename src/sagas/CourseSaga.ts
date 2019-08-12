import { all, call, put, putResolve, takeLatest } from 'redux-saga/effects'

import { dataApi } from 'api'

import {
  apiCourseToLocalFormat,
  getRaceId,
  loadCourse,
  SELECT_COURSE,
  selectCourseForEditing,
  selectRace,
  updateCourseLoading,
} from 'actions/courses'
import { CourseState } from 'models/Course'

function* fetchCourse(
  regattaName: string,
  raceName: string,
  leaderboardName: string,
) {
  yield put(updateCourseLoading(true))

  // TODO: Inject serverURL
  const api = dataApi('https://sapsailing.com')
  const raceId = getRaceId(regattaName, raceName)
  const apiCourse = yield call(api.requestCourse, regattaName, raceName)
  const course: { [id: string]: CourseState } = yield putResolve(
    apiCourseToLocalFormat(apiCourse, raceId, leaderboardName)
  )

  yield put(loadCourse(course))
}

export function* selectCourseFlow({ payload }: any) {
  const { newCourse, raceName } = payload
  // const { regattaName, leaderboardName } = yield select(getSelectedEventInfo())
  const { regattaName, leaderboardName } = { regattaName: 'TW 2013 (Finn)', leaderboardName: 'TW 2013 (Finn)' }

  // yield put(selectRace(raceName))
  // TODO: Uncomment the line on top when not using the Finn leaderboard with
  yield put(selectRace('R2'))

  const raceId = getRaceId(regattaName, raceName)
  if (!newCourse) {
    yield call(fetchCourse, regattaName, raceName, leaderboardName)
  }
  yield put(selectCourseForEditing(raceId))
  yield put(updateCourseLoading(false))
}

export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
  ])
}
