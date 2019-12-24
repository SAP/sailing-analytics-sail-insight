import { FETCH_PERMISSIONS_FOR_EVENT, updatePermissions } from 'actions/permissions'
import { takeLatest, all, call, put } from 'redux-saga/effects'
import { authApi } from 'api'

export function* fetchPermissionsForEvent({ payload }: any) {
  const permissions = [`EVENT:UPDATE:${payload.eventId}`]
  const result = yield call(authApi(payload.serverUrl).hasPermissions, permissions)

  console.log('check permission result', result)

  yield put(updatePermissions(result))
}

export default function* watchPermissions() {
  yield all([
    takeLatest(FETCH_PERMISSIONS_FOR_EVENT, fetchPermissionsForEvent)
  ])
}
