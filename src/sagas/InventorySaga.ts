import { takeLatest, call, put, takeEvery } from 'redux-saga/effects'
import { LOAD_MARK_PROPERTIES } from 'actions/inventory'

import { receiveEntities } from 'actions/entities'
import { getServerUrlSetting } from 'selectors/settings'

import { dataApi } from 'api'

function* loadMarkProperties() {
  const api = dataApi(getServerUrlSetting())
  const markProperties = yield call(api.requestMarkProperties)

  yield put(receiveEntities(markProperties))
}

function* removeEntity({ payload }: any) {
  if (payload.entityType !== 'markProperties')
    return

  const api = dataApi(getServerUrlSetting())

  try {
    yield api.removeMarkProperty(payload.id)
  } catch (e) {
    console.log('error deleting mark properties')
  }
}

export default function* watchEvents() {
  yield takeLatest(LOAD_MARK_PROPERTIES, loadMarkProperties)
  yield takeEvery('REMOVE_ENTITY', removeEntity)
}
