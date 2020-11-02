
import { all } from 'redux-saga/effects'

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
