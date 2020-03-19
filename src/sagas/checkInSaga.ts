import { DELETE_MARK_BINDING } from 'actions/checkIn'
import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { dataApi } from 'api'
import { updateCheckIn, updateDeletingMarkBinding } from 'actions/checkIn'
import { stopTracking } from 'actions/tracking'
import { getDeviceId } from 'services/CheckInService'
import { getMarkBindingCheckIn } from 'selectors/checkIn'

// Stop tracking and remove binding and set the checkIn markid to null
function* deleteMarkBinding({ payload }: any) {
  const checkIn = yield select(getMarkBindingCheckIn)
  const { leaderboardName, serverUrl, secret, markId } = checkIn

  const { shouldStopTracking } = payload

  if (shouldStopTracking) {
    yield put(stopTracking(checkIn))
  }

  const api = dataApi(serverUrl)
  try {
    const deviceMappinpData = {
      markId,
      deviceUuid: getDeviceId(),
      toMillis: new Date().getTime(),
      ...(secret ? { secret } : {}),
    }

    yield call(api.stopDeviceMapping, leaderboardName, deviceMappinpData)

    const updatedCheckIn = {
      leaderboardName,
      markId: undefined
    }

    yield put(updateCheckIn(updatedCheckIn))
  } catch (err) {}

  yield put(updateDeletingMarkBinding(false))
}

export default function* watchCheckIn() {
  yield all([
    takeLatest(DELETE_MARK_BINDING, deleteMarkBinding)
  ])
}
