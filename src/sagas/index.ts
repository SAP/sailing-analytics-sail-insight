import crashlytics from '@react-native-firebase/crashlytics'

import { all, call } from 'redux-saga/effects'

import watchCourses from './CourseSaga'
import watchCheckIn from './checkInSaga'
import watchEvents from './EventsSaga'
import watchMarks from './InventorySaga'
import watchPermissions from './permissionsSaga'
import watchOffline from './OfflineSaga'
import watchCommunications from './CommunicationsSaga'
import watchSettings from './SettingsSaga'
import watchAppState from './AppStateSaga'
import watchLeaderboard from './leaderboardSaga'

export function* safe(effect) {
  try {
    return { result: yield effect, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export function* safeApiCall(method, ...args) {
  let result

  try {
    result = yield call(method, ...args)
  } catch (e) {
    crashlytics().setAttribute('saga', 'true')
    crashlytics().recordError(e)
  }

  return result
}

export default function* rootSaga() {
  yield all([
    watchCourses(),
    watchEvents(),
    watchMarks(),
    watchPermissions(),
    watchCheckIn(),
    watchOffline(),
    watchCommunications(),
    watchSettings(),
    watchAppState(),
    watchLeaderboard()
  ])
}
