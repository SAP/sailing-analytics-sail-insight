
import { Task } from 'redux-saga'
import { all, delay, join, spawn } from 'redux-saga/effects'

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

const WatcherRestartDelay = 1000

const watchers = [
  watchCourses,
  watchEvents,
  watchMarks,
  watchPermissions,
  watchCheckIn,
  watchOffline,
  watchCommunications,
  watchSettings,
  watchAppState,
  watchLeaderboard
]

// An unhandled error inside a watcher used to bubble up through `all([...])` and
// terminate the whole saga tree, which left the app silently unresponsive until
// the next restart (see issue #64). Each watcher now runs as its own detached
// task and is restarted after an unhandled error, so a failure stays local to
// its feature.
//
// The watcher is spawned rather than called: a detached task is a root task, so
// its error is still reported to the middleware's `onError` together with the
// saga stack that names the failing task and effect. Joining it afterwards
// re-raises that error here, which is what drives the restart.
function* keepAlive(watcher: () => Generator): Generator<any, void, any> {
  while (true) {
    const task: Task = yield spawn(watcher)

    try {
      yield join(task)
      return
    } catch (error) {
      // Already recorded by `onError`; back off so a watcher that fails
      // synchronously cannot spin the JS thread.
      yield delay(WatcherRestartDelay)
    }
  }
}

export default function* rootSaga() {
  yield all(watchers.map(watcher => spawn(keepAlive, watcher)))
}
