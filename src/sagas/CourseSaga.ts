import { map, evolve, merge, curry, dissoc, not,
  prop, assoc, mergeLeft, compose, reduce, keys,
  find, eqProps, propEq, when, tap, defaultTo, isEmpty,
  __, head, last, includes, flatten, reject } from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import uuidv4 from 'uuid/v4'
import {
  loadCourse,
  saveCourse,
  SAVE_COURSE,
  SELECT_COURSE,
  TOGGLE_SAME_START_FINISH,
  NAVIGATE_BACK_FROM_COURSE_CREATION,
  FETCH_AND_UPDATE_MARK_CONFIGURATION_DEVICE_TRACKING,
  editCourse,
  updateCourseLoading,
  replaceWaypointMarkConfiguration,
  assignMarkOrMarkPropertiesToMarkConfiguration,
  changeWaypointMarkConfigurationToNew,
  changeWaypointToNewLine,
  updateMarkConfigurationDeviceTracking
} from 'actions/courses'
import { selectRace } from 'actions/events'
import { loadMarkProperties } from 'sagas/InventorySaga'
import { getMarkPropertiesOrMarkForCourseByName } from 'selectors/inventory'
import { getCourseById, getEditedCourse, hasSameStartFinish,
  hasEditedCourseChanged, getSelectedMarkConfiguration,
  getMarkConfigurationById } from 'selectors/course'
import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { navigateToRaceCourseLayout } from 'navigation'

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
  const { regattaName, serverUrl } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  navigateToRaceCourseLayout()

  yield put(updateCourseLoading(true))
  yield put(selectRace(race))

  const latestCourseState = yield call(api.requestCourse, regattaName, race, 'Default')

  yield  put(loadCourse({
    raceId: `${regattaName} - ${race}`,
    course: latestCourseState
  }))

  yield call(loadMarkProperties)

  const raceId = getRaceId(regattaName, race)
  const course = yield select(getCourseById(raceId))
  const isNewCourse = compose(isEmpty, prop('waypoints'))(course)

  let editedCourse

  if (!isNewCourse) {
    editedCourse = course
  } else {
    editedCourse = newCourse()
    editedCourse.markConfigurations = latestCourseState.markConfigurations
  }

  editedCourse = courseWithWaypointIds(editedCourse)

  yield put(editCourse(editedCourse))

  if (isNewCourse) {
    const startFinishPin = yield select(getMarkPropertiesOrMarkForCourseByName('Start/Finish Pin'))
    const startFinishBoat = yield select(getMarkPropertiesOrMarkForCourseByName('Start/Finish Boat'))
    const windwardMark = yield select(getMarkPropertiesOrMarkForCourseByName('Windward Mark'))

    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration,
      editedCourse.waypoints[0].id, editedCourse.waypoints[0].markConfigurationIds[0], startFinishPin)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration,
      editedCourse.waypoints[0].id, editedCourse.waypoints[0].markConfigurationIds[1], startFinishBoat)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration,
      editedCourse.waypoints[1].id, editedCourse.waypoints[1].markConfigurationIds[0], windwardMark)
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

function* assignMarkOrMarkPropertiesToWaypointMarkConfiguration(waypointId, markConfigurationId, markOrMarkProperties) {
  if (markOrMarkProperties.isMarkConfiguration) {
    yield put(replaceWaypointMarkConfiguration({
      id: waypointId,
      oldId: markConfigurationId,
      newId: markOrMarkProperties.id
    }))
  } else {
    const newId = uuidv4()

    yield put(changeWaypointMarkConfigurationToNew({
      id: waypointId,
      oldId: markConfigurationId,
      newId
    }))

    yield put(assignMarkOrMarkPropertiesToMarkConfiguration({
      id: newId,
      markOrMarkProperties: markOrMarkProperties
    }))
  }
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

    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[0], startPin)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[1], startBoat)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, finishWaypointId, newFinishMarkConfigurations[0], finishPin)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, finishWaypointId, newFinishMarkConfigurations[1], finishBoat)
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

    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[0], startFinishPin)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, startWaypointId, startMarkConfigurations[1], startFinishBoat)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, finishWaypointId, startMarkConfigurations[0], startFinishPin)
    yield call(assignMarkOrMarkPropertiesToWaypointMarkConfiguration, finishWaypointId, startMarkConfigurations[1], startFinishBoat)
  }
}

const showSaveCourseAlert = () => new Promise((resolve, reject) =>
  Alert.alert('Would you like to save the course?', '',
    [ { text: 'Don\'t save', onPress: () => reject('doNotSave') },
      { text: 'Save', onPress: () => resolve('save') }]))

function* navigateBackFromCourseCreation() {
  const hasChanged = yield select(hasEditedCourseChanged)

  if (!hasChanged) return

  try {
    yield call(showSaveCourseAlert)
    yield put(saveCourse())

    Snackbar.show({
      title: 'Course successfully saved',
      duration: Snackbar.LENGTH_LONG
    })
  } catch (error) {}
}

function* fetchAndUpdateMarkConfigurationDeviceTracking() {
  const selectedMarkConfiguration = yield select(getSelectedMarkConfiguration)
  const markConfiguration = yield select(getMarkConfigurationById(selectedMarkConfiguration))
  const { serverUrl, leaderboardName, secret } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  const markState = yield call(api.requestMark, leaderboardName, markConfiguration.markId, secret)

  try {
    yield call(updateMarkConfigurationDeviceTracking, {
      id: selectedMarkConfiguration,
      deviceId: markState.location && markState.location.deviceUUID
    })
  } catch(error) {}
}

export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
    takeLatest(TOGGLE_SAME_START_FINISH, toggleSameStartFinish),
    takeLatest(NAVIGATE_BACK_FROM_COURSE_CREATION, navigateBackFromCourseCreation),
    takeLatest(FETCH_AND_UPDATE_MARK_CONFIGURATION_DEVICE_TRACKING, fetchAndUpdateMarkConfigurationDeviceTracking)
  ])
}
