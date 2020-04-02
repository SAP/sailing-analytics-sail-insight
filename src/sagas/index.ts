import { all } from 'redux-saga/effects'

import watchCourses from './CourseSaga'
import watchCheckIn from './checkInSaga'
import watchEvents from './EventsSaga'
import watchMarks from './InventorySaga'
import watchPermissions from './permissionsSaga'
import watchOffline from './OfflineSaga'
import watchCommunications from './CommunicationsSaga'
import watchSettings from './SettingsSaga'

export function* safe(effect) {
  try {
    return { result: yield effect, error: null }
  } catch (error) {
    return { result: null, error }
  }
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
    watchSettings()
  ])
}
