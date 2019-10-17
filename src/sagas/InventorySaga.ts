import { when, isEmpty, always, prop, compose } from 'ramda'
import { takeLatest, all, select, call, put } from 'redux-saga/effects'
import { LOAD_MARK_INVENTORY } from 'actions/inventory'

import { receiveEntities } from 'actions/entities'

import { dataApi } from 'api'

import {
  getServerUrlSetting
} from 'selectors/settings'

function* loadInventory({ payload }: any) {
  const api = dataApi(getServerUrlSetting())
  const marks = yield call(api.requestMarkProperties)

  yield put(receiveEntities(marks))
}

export default function* watchEvents() {
  yield takeLatest(LOAD_MARK_INVENTORY, loadInventory)
}
