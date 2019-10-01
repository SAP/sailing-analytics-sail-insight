import { takeLatest, all, select, call, put } from 'redux-saga/effects'
import { SELECT_EVENT } from 'actions/events'
import { getSelectedEventInfo } from 'selectors/event'
import { getRegattaPlannedRaces } from 'selectors/regatta'

import { dataApi } from 'api'

function* selectEventFlow({ payload }: any) {
  console.log('select event')

  const { serverUrl, regattaName } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  const races = yield select(getRegattaPlannedRaces(regattaName))

  // const raceCourses = yield all(races.map((raceName: string) => call(api.requestCourse, regattaName, raceName)))

  // console.log('###', raceCourses)
}

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventFlow)
}
