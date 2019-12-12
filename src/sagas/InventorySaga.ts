import { takeLatest, call, put, takeEvery, select, all } from 'redux-saga/effects'
import { LOAD_MARK_PROPERTIES } from 'actions/inventory'

import { receiveEntities, removeEntity as removeEntityAction, removeEntities } from 'actions/entities'
import { getServerUrlSetting } from 'selectors/settings'
import { getMarkProperties } from 'selectors/inventory'

import { dataApi } from 'api'

function* loadMarkProperties() {
  const api = dataApi(getServerUrlSetting())
  const markProperties = yield call(api.requestMarkProperties)

  yield put(removeEntities({ type: 'markProperties' }))
  yield put(receiveEntities(markProperties))
}

function* removeAllMarkProperties() {
  const markProperties = yield select(getMarkProperties)

  yield all(markProperties.map(markProperties =>
    put(removeEntityAction({ entityType: 'markProperties', id: markProperties.id }))))
}

function* removeEntity({ payload }: any) {
  if (payload.entityType !== 'markProperties')
    return

  const api = dataApi(getServerUrlSetting())

  try {
    yield api.removeMarkProperty(payload.id)
  } catch (e) {
  }
}

export default function* watchEvents() {
  yield takeLatest(LOAD_MARK_PROPERTIES, loadMarkProperties)
  yield takeEvery('REMOVE_ENTITY', removeEntity)
  yield takeLatest('REMOVE_ALL_MARK_PROPERTIES', removeAllMarkProperties)
}
