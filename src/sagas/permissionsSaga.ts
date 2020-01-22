import { FETCH_EVENT_PERMISSION, updateEventPermissions } from 'actions/permissions'
import { takeLatest, all, call, put } from 'redux-saga/effects'
import { authApi } from 'api'

export function* fetchPermissionsForEvent({ payload }: any) {
  const permissions = [`EVENT:UPDATE:${payload.eventId}`]
  const result = yield call(authApi(payload.serverUrl).hasPermissions, permissions)

  return yield put(updateEventPermissions(result))
}

export default function* watchPermissions() {
  yield all([
    takeLatest(FETCH_EVENT_PERMISSION, fetchPermissionsForEvent)
  ])
}
