import { takeLatest, all, select, call, put } from 'redux-saga/effects'
import { SELECT_EVENT } from 'actions/events'
import { receiveEntities } from 'actions/entities'
import { getSelectedEventInfo } from 'selectors/event'

import { dataApi } from 'api'

function* selectEventFlow({ payload: eventId }: any) {
  const { serverUrl } = yield select(getSelectedEventInfo)

  const api = dataApi(serverUrl)
  const response = yield call(api.requestEventRacestates, eventId)
  
  yield put(receiveEntities(response))
}

export default function* watchEvents() {
    yield all([
        takeLatest(SELECT_EVENT, selectEventFlow)
    ])
}