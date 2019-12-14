import { map, evolve, merge, curry, dissoc, not,
  prop, assoc, mergeLeft, compose, reduce, keys,
  find, eqProps, propEq, when, tap, defaultTo,
  addIndex, __ } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import uuidv4 from 'uuid/v4'

import {
  loadCourse,
  SAVE_COURSE,
  SELECT_COURSE,
  editCourse,
  updateCourseLoading,
} from 'actions/courses'
import { selectRace } from 'actions/events'
import { loadMarkProperties } from 'sagas/InventorySaga'

const mapIndexed = addIndex(map)

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

import { assignMarkPropertiesToMarkConfiguration } from 'actions/courses'
import { getMarkProperties } from 'selectors/inventory'
import { getCourseById, getEditedCourse } from 'selectors/course'

import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'

const getRaceId = (regattaName: string, raceName: string) =>
  `${regattaName} - ${raceName}`

const newCourse = () => {
  const startBoatId = uuidv4()
  const startPinId = uuidv4()
  const windwardMarkId = uuidv4()

  return {
    markConfigurations: [
      { id: startPinId },
      { id: startBoatId },
      { id: windwardMarkId }
    ],
    waypoints: [
      { passingInstruction: 'Gate', markConfigurationIds: [startPinId, startBoatId], controlPointName: 'Start', controlPointShortName: 'S' },
      { passingInstruction: 'Port', markConfigurationIds: [windwardMarkId] },
      { passingInstruction: 'Gate', markConfigurationIds: [startPinId, startBoatId], controlPointName: 'Finish', controlPointShortName: 'F' }]
  }
}

const courseWithWaypointIds = evolve({
  waypoints: map(w => merge(w, { id: uuidv4() }))
})

function* selectCourseFlow({ payload }: any) {
  const { race } = payload
  const { regattaName } = yield select(getSelectedEventInfo)

  yield put(updateCourseLoading(true))

  yield put(selectRace(race))
  yield call(loadMarkProperties)

  const raceId = getRaceId(regattaName, race)
  const course = yield select(getCourseById(raceId))

  const isNewCourse = !course
  let editedCourse

  if (!isNewCourse) {
    editedCourse = yield select(getCourseById(raceId))
  } else {
    editedCourse = newCourse()
  }

  yield put(editCourse(courseWithWaypointIds(editedCourse)))

  if (isNewCourse) {
    const markProperties = yield select(getMarkProperties)

    yield all(compose(
      mapIndexed((mp, index) => put(assignMarkPropertiesToMarkConfiguration({
        id: editedCourse.markConfigurations[index].id,
        markProperties: mp
      }))),
      map(find(__, markProperties)),
      map(propEq('name')))([
      'Start/Finish Pin', 'Start/Finish Boat', 'Windward Mark'
    ]))
  }

  yield put(updateCourseLoading(false))
}

const hasMarkConfigurationChangedAcrossCourses = curry((fromCourse, toCourse, configuration) => {
  const getById = id => compose(
    defaultTo({}),
    find(propEq('id', id)),
    defaultTo([]),
    prop('markConfigurations'))
  const getByConfigurationId = getById(configuration.id)

  const from = getByConfigurationId(fromCourse)
  const to = getByConfigurationId(toCourse)

  return !eqProps('effectiveProperties', from, to) && from.markPropertiesId === to.markPropertiesId
})

function* saveCourseFlow() {
  const { serverUrl, regattaName, raceColumnName, fleet } = yield select(getSelectedRaceInfo)
  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, raceColumnName)

  const editedCourse = yield select(getEditedCourse)
  const existingCourse = yield select(getCourseById(raceId))
  const hasMarkConfigurationChange = hasMarkConfigurationChangedAcrossCourses(existingCourse, editedCourse)

  const course = evolve({
    waypoints: map(dissoc('id')),
    markConfigurations: map(compose(
      renameKeys({ effectivePositioning: 'positioning' }),
      dissoc('effectiveProperties'),
      when(hasMarkConfigurationChange, compose(
        dissoc('markId'),
        mergeLeft({ storeToInventory: true }),
        renameKeys({ effectiveProperties: 'freestyleProperties' })
      ))))
  }, editedCourse)

  const updatedCourse = yield call(api.createCourse, regattaName, raceColumnName, fleet, course)

  yield put(loadCourse({
    raceId,
    course: courseWithWaypointIds(updatedCourse)
  }))

  yield call(loadMarkProperties)
}

export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
  ])
}
