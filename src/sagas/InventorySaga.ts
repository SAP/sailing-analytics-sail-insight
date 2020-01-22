import { filter, compose, not, __, find, propEq, values,
  curry, isEmpty } from 'ramda'
import { takeLatest, call, put, takeEvery, select, all } from 'redux-saga/effects'
import { markPropertiesSchema } from 'api/schemas'
import { LOAD_MARK_PROPERTIES } from 'actions/inventory'

import { receiveEntities, removeEntity as removeEntityAction, removeEntities,
  normalizeAndReceiveEntities } from 'actions/entities'
import { getServerUrlSetting } from 'selectors/settings'
import { getMarkProperties } from 'selectors/inventory'
import { isLoggedIn } from 'selectors/auth'

import { dataApi } from 'api'

const defaultMarkProperties = [
  { name: 'Start/Finish Pin', shortName: 'SFP', markType: 'BUOY' },
  { name: 'Start/Finish Boat', shortName: 'SFB', markType: 'STARTBOAT' },
  { name: 'Start Pin', shortName: 'SP', markType: 'BUOY' },
  { name: 'Start Boat', shortName: 'SB', markType: 'STARTBOAT' },
  { name: 'Finish Pin', shortName: 'FP', markType: 'BUOY' },
  { name: 'Finish Boat', shortName: 'FB', markType: 'FINISHBOAT' },
  { name: 'Windward Mark', shortName: 'W', markType: 'BUOY' },
  { name: 'Leeward Mark', shortName: 'L', markType: 'BUOY' },
  { name: 'Reaching Mark', shortName: 'R', markType: 'BUOY' },
]

export function* loadMarkProperties() {
  const hasUser = yield select(isLoggedIn)

  if (!hasUser) return

  const api = dataApi(getServerUrlSetting())
  const markProperties = yield call(api.requestMarkProperties)

  const hasMarkProperties = curry((list, mp) => find(propEq('name', mp.name), list))
  const missingDefaultMarkProperties =
    filter(
      compose(not, hasMarkProperties(values(markProperties.entities.markProperties))),
      defaultMarkProperties)

  yield put(removeEntities({ type: 'markProperties' }))
  yield put(receiveEntities(markProperties))

  if (!isEmpty(missingDefaultMarkProperties)) { 
    const newMarkProperties = yield all(missingDefaultMarkProperties.map(mp => call(api.createMarkProperties, mp)))

    yield put(normalizeAndReceiveEntities(newMarkProperties, [markPropertiesSchema]))
  }
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
