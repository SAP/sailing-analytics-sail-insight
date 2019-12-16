import { map, evolve, merge, curry, dissoc, not,
  prop, assoc, mergeLeft, compose, reduce, keys,
  find, eqProps, propEq, when, tap, defaultTo,
  addIndex, __, head, last, includes, flatten, reject } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import uuidv4 from 'uuid/v4'
import {
  loadCourse,
  SAVE_COURSE,
  SELECT_COURSE,
  TOGGLE_SAME_START_FINISH,
  editCourse,
  updateCourseLoading,
  replaceWaypointMarkConfiguration,
  assignMarkPropertiesToMarkConfiguration,
  changeWaypointToNewLine
} from 'actions/courses'
import { selectRace } from 'actions/events'
import { loadMarkProperties } from 'sagas/InventorySaga'
import { getMarkProperties, getMarkPropertiesOrMarkForCourseByName } from 'selectors/inventory'
import { getCourseById, getEditedCourse, hasSameStartFinish } from 'selectors/course'
import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'

const mapIndexed = addIndex(map)

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

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

const courseWaypointsUseMarkConfiguration = curry((markConfigurationId, course) => compose(
  includes(markConfigurationId),
  flatten,
  map(prop('markConfigurationIds')))(
  course.waypoints))

function* saveCourseFlow() {
  const { serverUrl, regattaName, raceColumnName, fleet } = yield select(getSelectedRaceInfo)
  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, raceColumnName)

  const editedCourse = yield select(getEditedCourse)
  const existingCourse = yield select(getCourseById(raceId))
  const hasMarkConfigurationChange = hasMarkConfigurationChangedAcrossCourses(existingCourse, editedCourse)
  const markConfigurationUsedInEditedCourse = courseWaypointsUseMarkConfiguration(__, editedCourse)

  const course = evolve({
    waypoints: map(dissoc('id')),
    markConfigurations: compose(
      map(compose(
        renameKeys({ effectivePositioning: 'positioning' }),
        dissoc('effectiveProperties'),
        when(hasMarkConfigurationChange, compose(
          dissoc('markId'),
          mergeLeft({ storeToInventory: true }),
          renameKeys({ effectiveProperties: 'freestyleProperties' }))))),
      reject(compose(not, markConfigurationUsedInEditedCourse, prop('id'))))
  }, editedCourse)

  const updatedCourse = yield call(api.createCourse, regattaName, raceColumnName, fleet, course)

  yield put(loadCourse({
    raceId,
    course: courseWithWaypointIds(updatedCourse)
  }))

  yield call(loadMarkProperties)
}

function* assignMarkPropertiesOrMarkToWaypointMarkConfiguration(waypointId, markConfigurationId, markPropertiesOrMark) {
  markPropertiesOrMark.markId ?
    yield put(replaceWaypointMarkConfiguration({
      id: waypointId,
      oldId: markConfigurationId,
      newId: markPropertiesOrMark.id
    })) :
    yield put(assignMarkPropertiesToMarkConfiguration({
      id: markConfigurationId,
      markProperties: markPropertiesOrMark
    }))
}

function* toggleSameStartFinish() {
  const editedCourse = yield select(getEditedCourse)
  const isSameStartFinish = yield select(hasSameStartFinish)
  const startMarkConfigurations = head(editedCourse.waypoints).markConfigurationIds
  const finishMarkConfigurations = last(editedCourse.waypoints).markConfigurationIds
  const startWaypointId = head(editedCourse.waypoints).id
  const finishWaypointId = last(editedCourse.waypoints).id

  if (isSameStartFinish) {
    const startPin = yield select(getMarkPropertiesOrMarkForCourseByName('Start Pin'))
    const startBoat = yield select(getMarkPropertiesOrMarkForCourseByName('Start Boat'))
    const finishPin = yield select(getMarkPropertiesOrMarkForCourseByName('Finish Pin'))
    const finishBoat = yield select(getMarkPropertiesOrMarkForCourseByName('Finish Boat'))

    const newFinishMarkConfigurations = [uuidv4(), uuidv4()]

    yield put(changeWaypointToNewLine({
      id: finishWaypointId,
      markConfigurationIds: newFinishMarkConfigurations,
      controlPointName: 'Finish',
      controlPointShortName: 'F'
    }))

    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[0], startPin)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[1], startBoat)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, finishWaypointId, newFinishMarkConfigurations[0], finishPin)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, finishWaypointId, newFinishMarkConfigurations[1], finishBoat)
  } else {
    const startFinishPin = yield select(getMarkPropertiesOrMarkForCourseByName('Start/Finish Pin'))
    const startFinishBoat = yield select(getMarkPropertiesOrMarkForCourseByName('Start/Finish Boat'))

    yield put(replaceWaypointMarkConfiguration({
      id: finishWaypointId,
      oldId: finishMarkConfigurations[0],
      newId: startMarkConfigurations[0]
    }))
    yield put(replaceWaypointMarkConfiguration({
      id: finishWaypointId,
      oldId: finishMarkConfigurations[1],
      newId: startMarkConfigurations[1]
    }))

    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[0], startFinishPin)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[1], startFinishBoat)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, finishWaypointId, startMarkConfigurations[0], startFinishPin)
    yield call(assignMarkPropertiesOrMarkToWaypointMarkConfiguration, finishWaypointId, startMarkConfigurations[1], startFinishBoat)
  }
}

export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
    takeLatest(TOGGLE_SAME_START_FINISH, toggleSameStartFinish)
  ])
}
