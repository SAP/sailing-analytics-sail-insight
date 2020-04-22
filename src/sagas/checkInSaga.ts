import I18n from 'i18n'
import Snackbar from 'react-native-snackbar'
import { DELETE_MARK_BINDING } from 'actions/checkIn'
import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { dataApi } from 'api'
import ApiException from 'api/ApiException'
import { receiveEntities } from 'actions/entities'
import { updateCheckInAndEventInventory, updateDeletingMarkBinding } from 'actions/checkIn'
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

    try {
      yield call(api.stopDeviceMapping, leaderboardName, deviceMappinpData)
    } catch (err) {
      // We surpress 400 status codes
      // because it indicates that the mapping does not exist.
      // In that case we can just ignore it, to not make the user stuck forever in the MarkTracking screen
      if (!(err instanceof ApiException) || err.status !== 400) {
        throw err
      }
    }

    // Remove positioning information from markProperties
    try {
      const updatedMarkProperties = yield call(api.updateMarkPropertyPositioning, markPropertiesId)
      yield put(receiveEntities(updatedMarkProperties))
    // Everyone who is not the owner of the markProperties to be edited will get an
    // error because of missing permissions, which we can ignore.
    } catch (err) {}

    const updatedCheckIn = {
      leaderboardName,
      markId: undefined
    }

    yield put(updateCheckInAndEventInventory(updatedCheckIn))
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
