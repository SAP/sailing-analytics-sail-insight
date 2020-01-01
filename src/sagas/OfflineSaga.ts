import { takeLatest } from 'redux-saga/effects'
import { offlineActionTypes } from 'react-native-offline'
import Snackbar from 'react-native-snackbar'

function* handleActionInOffline() {
  requestAnimationFrame(() => setTimeout(() => Snackbar.show({
    title: 'Network connection required to perform this action',
    duration: Snackbar.LENGTH_LONG
  }), 100))
}

export default function* watchEvents() {
  yield takeLatest(offlineActionTypes.FETCH_OFFLINE_MODE, handleActionInOffline)
}
