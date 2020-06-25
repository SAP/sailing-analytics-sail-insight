import { registerAppStateListeners, unregisterAppStateListeners, updateAppState } from 'actions/appState'
import { takeLatest, all, put, take, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { AppState } from 'react-native'

let appStateChannel: any

function* handleAppStateChange() {
  appStateChannel = eventChannel((listener: any) => {
    const handleEvent = (event: any) => {
      listener(event)
    }

    AppState.addEventListener('change', (event) => {
      handleEvent(event)
    })
    return () => {
      AppState.removeEventListener('change', handleEvent)
    }
  })
  try {
    while (true) {
      const appState = yield take(appStateChannel)
      yield put(updateAppState(appState === 'active'))
    }
  } finally {
    appStateChannel.close()
  }
}

export function* registerAppStateListenersSaga() {
  yield call(handleAppStateChange)
}

export function* unregisterAppStateListenersSaga() {
  if (appStateChannel) {
    appStateChannel.close()
  }
}



export default function* watchPermissions() {
  yield all([
    takeLatest(registerAppStateListeners, registerAppStateListenersSaga),
    takeLatest(unregisterAppStateListeners, unregisterAppStateListenersSaga)
  ])
}