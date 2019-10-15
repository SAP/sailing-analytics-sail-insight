import { when, isEmpty, always, prop, compose } from 'ramda'
import { takeLatest, all, select, call, put } from 'redux-saga/effects'
import { SELECT_EVENT } from 'actions/events'
import { getSelectedEventInfo } from 'selectors/event'
import { getRegattaPlannedRaces } from 'selectors/regatta'

import { loadCourse } from 'actions/courses'

import { dataApi } from 'api'

function* selectEventFlow({ payload }: any) {
  const { serverUrl, regattaName } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  const races = yield select(getRegattaPlannedRaces(regattaName))
  
  const raceCourses = yield all(races.map((raceName: string) =>
    call(api.requestCourse, regattaName, raceName, 'Default')
  ))

  yield all(raceCourses.map((course: object, index: number) => put(loadCourse({
    [`${regattaName} - ${races[index]}`]: when(compose(isEmpty, prop('waypoints')), always(null), course)
  }))))
}

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventFlow)
}
