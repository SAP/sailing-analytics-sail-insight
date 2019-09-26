import { takeLatest, all, select, call, put } from 'redux-saga/effects'
import { SELECT_EVENT } from 'actions/events'
import { receiveEntities } from 'actions/entities'
import { getSelectedEventInfo } from 'selectors/event'

import { dataApi } from 'api'

function* selectEventFlow({ payload }: any) {
  const { serverUrl } = yield select(getSelectedEventInfo)

  const api = dataApi(serverUrl)
  const raceStates = yield call(api.requestEventRacestates, payload.eventId)
  
  yield put(receiveEntities(raceStates))
}

export default function* watchEvents() {
    yield all([
        takeLatest(SELECT_EVENT, selectEventFlow)
    ])
}