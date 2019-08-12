import { all } from 'redux-saga/effects'

import watchCourses from './CourseSaga'

export default function* rootSaga() {
  yield all([
    watchCourses(),
  ])
}
