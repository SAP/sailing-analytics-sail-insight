import { takeLatest } from 'redux-saga/effects'
import { offlineActionTypes } from 'react-native-offline'

import { showNetworkRequiredSnackbarMessage } from 'helpers/network'

function* handleActionInOffline() {
  requestAnimationFrame(() => setTimeout(showNetworkRequiredSnackbarMessage, 100))
}

export default function* watchEvents() {
  yield takeLatest(offlineActionTypes.FETCH_OFFLINE_MODE, handleActionInOffline)
}
