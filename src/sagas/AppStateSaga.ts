import { 
  registerAppStateListeners, 
  unregisterAppStateListeners, 
  registerNetStateListeners, 
  unregisterNetStateListeners, 
  updateAppState, 
  updateNetState 
} from 'actions/appState'
import { takeLatest, all, put, take, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { AppState } from 'react-native'
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'

let appStateChannel: any
let networkChannel: any

function* handleAppStateChange() {
  appStateChannel = eventChannel((listener: any) => {
    AppState.addEventListener('change', listener)
    
    return () => {
      AppState.removeEventListener('change', listener)
    }
  })
  try {
    while (true) {
      const appState = yield take(appStateChannel)
      yield put(updateAppState(appState === 'active'))
      if (appState === 'active') {
        const networkState = yield call(getNetworkStatePromise)
        updateNetworkAvailability(networkState)
      }
    }
  } finally {
    appStateChannel.close()
  }
}

function getNetworkStatePromise() {
  return NetInfo.fetch()
}

function *updateNetworkAvailability(state: NetInfoState) {
  yield put(updateNetState(state.isConnected && state.isInternetReachable))
}

function* handleNetworkChange() {
  networkChannel = eventChannel((listener: any) => {
    const unsubscribe = NetInfo.addEventListener(listener)
    
    return () => {
      unsubscribe()
    }
  })
  try {
    while (true) {
      const networkState = yield take(networkChannel)
      updateNetworkAvailability(networkState)
    }
  } finally {
    networkChannel.close()
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

export function* registerNetStateListenersSaga() {
  yield call(handleNetworkChange)
}

export function* unregisterNetStateListenersSaga() {
  if (networkChannel) {
    networkChannel.close()
  }
}

export default function* watchPermissions() {
  yield all([
    takeLatest(registerAppStateListeners, registerAppStateListenersSaga),
    takeLatest(unregisterAppStateListeners, unregisterAppStateListenersSaga),
    takeLatest(registerNetStateListeners, registerNetStateListenersSaga),
    takeLatest(unregisterNetStateListeners, unregisterNetStateListenersSaga)
  ])
}