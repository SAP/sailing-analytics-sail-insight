import { filter, compose, not, __, find, propEq, values,
  curry, isEmpty, mergeRight } from 'ramda'
import { takeLatest, put, takeEvery, select, all } from 'redux-saga/effects'
import { markPropertiesSchema } from 'api/schemas'
import { LOAD_MARK_PROPERTIES } from 'actions/inventory'

import { receiveEntities, removeEntity as removeEntityAction, removeEntities,
  normalizeAndReceiveEntities } from 'actions/entities'
import { getServerUrlSetting } from 'selectors/settings'
import { getMarkProperties } from 'selectors/inventory'
import { isLoggedIn } from 'selectors/auth'

import { dataApi } from 'api'
import { safeApiCall } from './HelpersSaga'

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

export function* loadMarkProperties({ payload }: any = { payload: { createMissingDefaultMarkProperties: true }}) {
  const hasUser = yield select(isLoggedIn)

  if (!hasUser) return

  const api = dataApi(getServerUrlSetting())
  const markProperties = yield safeApiCall(api.requestMarkProperties)

  // A failed request must not fall through as "no mark properties exist":
  // every default below would then be considered missing and recreated on the
  // server, producing duplicates on every hiccup.
  // No snackbar here: this runs as a side step of the course flows, which do
  // their own messaging. Reporting from here would replace "Course saved" with
  // an error right after a save that actually succeeded.
  if (markProperties === undefined) {
    console.warn('Failed to load mark properties')
    return
  }

  const markPropertiesList = markProperties?.entities?.markProperties
    ? values(markProperties.entities.markProperties)
    : []

  const hasMarkProperties = curry((list, mp) => find(propEq(mp.name, 'name'), list))
  const missingDefaultMarkProperties =
    filter(
      compose(not, hasMarkProperties(markPropertiesList)),
      defaultMarkProperties)

  yield put(receiveEntities(mergeRight(markProperties || {}, { replace: true })))

  if (!isEmpty(missingDefaultMarkProperties) && payload.createMissingDefaultMarkProperties) {
    const newMarkProperties = yield all(missingDefaultMarkProperties.map(mp =>
      safeApiCall(api.createMarkProperties, mp)))

    const createdMarkProperties = newMarkProperties.filter((mp: any) => mp !== undefined)

    if (createdMarkProperties.length < newMarkProperties.length) {
      console.warn('Failed to create default mark properties:',
        newMarkProperties.length - createdMarkProperties.length)
    }

    if (!isEmpty(createdMarkProperties)) {
      yield put(normalizeAndReceiveEntities(createdMarkProperties, [markPropertiesSchema]))
    }
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
