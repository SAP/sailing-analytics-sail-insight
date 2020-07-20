import I18n from 'i18n'
import Snackbar from 'react-native-snackbar'
import { DELETE_MARK_BINDING } from 'actions/checkIn'
import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { dataApi } from 'api'
import ApiException from 'api/ApiException'
import { receiveEntities } from 'actions/entities'
import { updateCheckInAndEventInventory, updateDeletingMarkBinding } from 'actions/checkIn'
import { stopTracking } from 'actions/tracking'
import { checkoutDeviceMappingData, getDeviceId } from 'services/CheckInService'
import { getCheckInsByMarkPropertiesId, getMarkBindingCheckIn, getMarkPropertiesIdOfBoundMark } from 'selectors/checkIn'

function* unbindMark(checkIn: any) {
  const { leaderboardName, markId, secret, serverUrl } = checkIn
  const api = dataApi(serverUrl)

  try {
    yield call(
      api.stopDeviceMapping,
      leaderboardName,
      checkoutDeviceMappingData({
        markId,
        secret,
      }),
    )
  } catch (err) {
    // 400 status codes indicate that the mapping does not exist.
    // 403 status codes also sometimes occur for some reason when removing bindings
    // We ignore all errors here to not make the user stuck forever in the MarkTracking screen
    if (!(err instanceof ApiException)) {
      throw err
    }
  }

  const updatedCheckIn = {
    leaderboardName,
    markId: undefined
  }

  yield put(updateCheckInAndEventInventory(updatedCheckIn))
}

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
    const checkInsToUpdate = markPropertiesId
      ? yield select(getCheckInsByMarkPropertiesId(markPropertiesId))
      : [checkIn] // If the markPropertiesId is missing, just remove this binding

    yield all(checkInsToUpdate.map(checkIn => call(unbindMark, checkIn)))

    // Remove positioning information from markProperties
    try {
      const updatedMarkProperties = yield call(api.updateMarkPropertyPositioning, markPropertiesId)
      yield put(receiveEntities(updatedMarkProperties))
    // Everyone who is not the owner of the markProperties to be edited will get an
    // error because of missing permissions, which we can ignore.
    } catch (err) {}
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
