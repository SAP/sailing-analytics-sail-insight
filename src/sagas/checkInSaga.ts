import I18n from 'i18n'
import Snackbar from 'react-native-snackbar'
import { DELETE_MARK_BINDING } from 'actions/checkIn'
import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { dataApi } from 'api'
import { receiveEntities } from 'actions/entities'
import { updateCheckIn, updateDeletingMarkBinding } from 'actions/checkIn'
import { stopTracking } from 'actions/tracking'
import { getDeviceId } from 'services/CheckInService'
import { getMarkBindingCheckIn, getMarkPropertiesIdOfBoundMark } from 'selectors/checkIn'

// Stop tracking and remove binding and set the checkIn markid to null
function* deleteMarkBinding({ payload }: any) {
  const checkIn = yield select(getMarkBindingCheckIn)
  const { leaderboardName, serverUrl, secret, markId } = checkIn
  const markPropertiesId = yield select(getMarkPropertiesIdOfBoundMark)

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

    // Remove positioning information from markProperties
    const updatedMarkProperties = yield call(api.updateMarkPropertyPositioning, markPropertiesId)
    yield put(receiveEntities(updatedMarkProperties))

    const updatedCheckIn = {
      leaderboardName,
      markId: undefined
    }

    yield put(updateCheckIn(updatedCheckIn))
  } catch (err) {
    console.log('Failed to delete mark binding', { err })
    Snackbar.show({
      title: I18n.t('error_unknown'),
      duration: Snackbar.LENGTH_SHORT
    })
  }

  yield put(updateDeletingMarkBinding(false))
}

export default function* watchCheckIn() {
  yield all([
    takeLatest(DELETE_MARK_BINDING, deleteMarkBinding)
  ])
}
