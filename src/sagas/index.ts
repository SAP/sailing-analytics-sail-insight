import { all } from 'redux-saga/effects'

import watchCourses from './CourseSaga'
import watchEvents from './EventsSaga'
import watchMarks from './InventorySaga'

export default function* rootSaga() {
  yield all([
    watchCourses(),
    watchEvents(),
    watchMarks()
  ])
}
