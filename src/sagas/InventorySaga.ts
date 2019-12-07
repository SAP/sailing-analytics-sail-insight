import { takeLatest, call, put, takeEvery } from 'redux-saga/effects'
import { LOAD_MARK_INVENTORY } from 'actions/inventory'

import { receiveEntities } from 'actions/entities'
import { getServerUrlSetting } from 'selectors/settings'

import { dataApi } from 'api'

function* loadInventory() {
  const api = dataApi(getServerUrlSetting())
  const marks = yield call(api.requestMarkProperties)

  yield put(receiveEntities(marks))
}

function* removeEntity({ payload }: any) {
  if (payload.entityType !== 'mark')
    return

  const api = dataApi(getServerUrlSetting())

  yield api.removeMarkProperty(payload.id)
}

export default function* watchEvents() {
  yield takeLatest(LOAD_MARK_INVENTORY, loadInventory)
  yield takeEvery('REMOVE_ENTITY', removeEntity)
}
