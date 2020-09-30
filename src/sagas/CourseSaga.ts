import { any, map, evolve, merge, curry, dissoc, not, has,
  prop, assoc, mergeLeft, compose, reduce, keys, objOf,
  find, findLast, eqProps, propEq, when, tap, defaultTo, isEmpty, isNil,
  __, head, last, includes, flatten, reject, filter, both, reverse, sortBy,
  toPairs, values, fromPairs, ifElse, always, findIndex, equals,
} from 'ramda'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { dataApi } from 'api'
import { safe, safeApiCall } from './index'
import uuidv4 from 'uuid/v4'
import {
  loadCourse,
  saveCourse,
  SAVE_COURSE,
  SELECT_COURSE,
  TOGGLE_SAME_START_FINISH,
  NAVIGATE_BACK_FROM_COURSE_CREATION,
  FETCH_AND_UPDATE_MARK_CONFIGURATION_DEVICE_TRACKING,
  UPDATE_MARK_POSITION,
  editCourse,
  updateCourseLoading,
  replaceWaypointMarkConfiguration,
  assignMarkOrMarkPropertiesToMarkConfiguration,
  changeWaypointMarkConfigurationToNew,
  changeWaypointToNewLine,
  changeMarkConfigurationDeviceTracking
} from 'actions/courses'
import { selectRace } from 'actions/events'
import * as Screens from 'navigation/Screens'
import { loadMarkProperties } from 'sagas/InventorySaga'
import { getHashedDeviceId } from 'selectors/user'
import { isNetworkConnected } from 'selectors/network'
import { getMarkPropertiesOrMarkForCourseByName } from 'selectors/inventory'
import { getCourseById, getEditedCourse, hasSameStartFinish,
  hasEditedCourseChanged, getSelectedMarkConfiguration,
  getMarkConfigurationById } from 'selectors/course'
import {
  getSelectedEventInfo,
  getSelectedRaceInfo
} from 'selectors/event'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { updateCheckInAndEventInventory } from 'actions/checkIn'
import { receiveEntities } from 'actions/entities'
import Snackbar from 'react-native-snackbar'
import I18n from 'i18n'
import { PassingInstruction } from 'models/Course'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'

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
      { passingInstruction: PassingInstruction.Line,
        markConfigurationIds: [startPinId, startBoatId],
        controlPointName: 'Start',
        controlPointShortName: 'S' },
      { passingInstruction: 'Port', markConfigurationIds: [windwardMarkId] },
      { passingInstruction: PassingInstruction.Line,
        markConfigurationIds: [startPinId, startBoatId],
        controlPointName: I18n.t('text_finish_waypoint_long_name'),
        controlPointShortName: I18n.t('text_finish_waypoint_short_name')}]
  }
}

const courseWithWaypointIds = evolve({
  waypoints: map(w => merge(w, { id: uuidv4() }))
})

const copyCourse = (courseToCopy: any, latestCopiedCourseState: any, latestTargetCourseState: any) => {
  // To copy over to another course we need to use the markConfigurations of
  // the target course
  const mapMarkPropertyIdToMarkConfiguration = compose(
    fromPairs,
    map(({ id, markPropertiesId }) => [markPropertiesId, id]),
    prop('markConfigurations')
  )(latestTargetCourseState)

  const mapMarkPropertyIdToLatest = compose(
    fromPairs,
    map(({ id, markPropertiesId }) => [id, mapMarkPropertyIdToMarkConfiguration[markPropertiesId]]),
    prop('markConfigurations')
  )(courseToCopy)

  const waypointsWithLatestIds = compose(
    map(evolve({
      markConfigurationIds: map((id) => {
        if (mapMarkPropertyIdToLatest[id]) {
          return mapMarkPropertyIdToLatest[id]
        }
        // The else only happens for newly created marks
        // Finds the index in the waypoint array for the newly created mark
        const waypointIndex = compose(
          findIndex(compose(
            includes(id),
            prop('markConfigurationIds')
          )),
          prop('waypoints')
        )(courseToCopy)

        // Finds the index in the waypoint mark pair (if it's a gate) for the newly created mark
        const markGateIndex = compose(
          findIndex(equals(id)),
          prop('markConfigurationIds'),
          prop(waypointIndex),
          prop('waypoints')
        )(courseToCopy)

        // Based on these two pieces of data finds the newly created mark's
        // markConfigurationId in the created course data from the server.
        // (If new marks are created the waypoints are not present iin latestTargetCourseState)
        const copiedMarkConfigurationId = compose(
          prop(markGateIndex),
          prop('markConfigurationIds'),
          prop(waypointIndex),
          prop('waypoints')
        )(latestCopiedCourseState)

        // Finds the markPropertyId of the newly created mark
        const copiedMarkPropertiesId = compose(
          prop('markPropertiesId'),
          find(propEq('id', copiedMarkConfigurationId)),
          prop('markConfigurations')
        )(latestCopiedCourseState)

        // Gets the markConfigurationId from the target course
        const latestId = compose(
          prop('id'),
          find(propEq('markPropertiesId', copiedMarkPropertiesId)),
          prop('markConfigurations')
        )(latestTargetCourseState)

        return latestId
      })
    })),
    prop('waypoints')
  )(courseToCopy)

  return {
    ...courseToCopy,
    markConfigurations: latestTargetCourseState.markConfigurations,
    waypoints: waypointsWithLatestIds
  }
}

function* fetchCourseFromServer({ regattaName, race, serverUrl }: any) {
  const api = dataApi(serverUrl)
  const latestCourseState = yield call(api.requestCourse, regattaName, race, 'Default')

  yield put(loadCourse({
    raceId: `${regattaName} - ${race}`,
    course: latestCourseState
  }))

  return latestCourseState
}

function* selectCourseFlow({ payload }: any) {
  const { race, navigation } = payload
  const { regattaName, serverUrl } = yield select(getSelectedEventInfo)

  navigation.navigate(Screens.RaceCourseLayout)

  yield put(updateCourseLoading(true))
  yield put(selectRace(race))

  const latestCourseState = yield call(fetchCourseFromServer, { regattaName, race, serverUrl })

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

const didConfigurationPropertyChangedAcrossCourses = curry((fromCourse, toCourse, property, configuration) => {
  const getById = id => compose(
    defaultTo({}),
    find(propEq('id', id)),
    defaultTo([]),
    prop('markConfigurations'))
  const getByConfigurationId = getById(configuration.id)

  const from = getByConfigurationId(fromCourse)
  const to = getByConfigurationId(toCourse)

  return isEmpty(from) || (!eqProps(property, from, to) && from.markPropertiesId === to.markPropertiesId)
})

const courseWaypointsUseMarkConfiguration = curry((markConfigurationId, course) => compose(
  includes(markConfigurationId),
  flatten,
  map(prop('markConfigurationIds')))(
  course.waypoints))

function* saveCourseToServer({ editedCourse, existingCourse, regattaName, raceColumnName, raceId, fleet, serverUrl }: any) {
  const api = dataApi(serverUrl)

  const didEffectivePropertiesChanged = didConfigurationPropertyChangedAcrossCourses(existingCourse, editedCourse, 'effectiveProperties')
  const didLastKnownPositionChanged = didConfigurationPropertyChangedAcrossCourses(existingCourse, editedCourse, 'lastKnownPosition')
  const markConfigurationUsedInEditedCourse = courseWaypointsUseMarkConfiguration(__, editedCourse)

  const course = evolve({
    waypoints: compose(
      reject(isEmpty),
      map(dissoc('id'))),
    markConfigurations: compose(
      map(compose(
        mergeLeft({ storeToInventory: true }),
        when(both(has('lastKnownPosition'), didLastKnownPositionChanged), compose(
          evolve({
            positioning: compose(
              objOf('position'),
              renameKeys({
                'lat_deg': 'latitude_deg',
                'lon_deg': 'longitude_deg' }))
          }),
          renameKeys({ lastKnownPosition: 'positioning' }),
        )),
        when(has('currentTrackingDeviceId'), compose(
          evolve({ positioning: objOf('device_identifier') }),
          renameKeys({ currentTrackingDeviceId: 'positioning' }),
          dissoc('lastKnownPosition'),
        )),
        dissoc('effectiveProperties'),
        when(didEffectivePropertiesChanged, compose(
          dissoc('markId'),
          renameKeys({ effectiveProperties: 'freestyleProperties' }))))),
      reject(compose(not, markConfigurationUsedInEditedCourse, prop('id'))))
  }, editedCourse)

  const updatedCourse = yield call(api.createCourse, regattaName, raceColumnName, fleet, course)

  yield put(loadCourse({
    raceId,
    course: courseWithWaypointIds(updatedCourse)
  }))

  return updatedCourse
}

function* saveCourseFlow({ navigation }: any) {
  const { serverUrl, regattaName, raceColumnName, fleet, leaderboardName, secret } = yield select(getSelectedRaceInfo)
  const api = dataApi(serverUrl)
  const raceId = getRaceId(regattaName, raceColumnName)

  const editedCourse = yield select(getEditedCourse)
  const existingCourse = yield select(getCourseById(raceId))
  const isConnected = yield select(isNetworkConnected)

  if (!isConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }

  navigation.goBack()

  const updatedCourse = yield call(saveCourseToServer, {
    editedCourse,
    existingCourse,
    regattaName,
    raceColumnName,
    raceId,
    fleet,
    serverUrl
  })

  const plannedRaces = yield select(getRegattaPlannedRaces(regattaName))

  const nextRaceColumnName = compose(
    ifElse(
      id => id >= 0 && id < plannedRaces.length - 1,
      id => plannedRaces[id + 1],
      always(undefined)
    ),
    findIndex(__, plannedRaces),
    equals,
  )(raceColumnName)

  if (nextRaceColumnName) {
    const latestNextRaceCourseState = yield call(fetchCourseFromServer, { regattaName, serverUrl, race: nextRaceColumnName })
    const nextCourse = copyCourse(editedCourse, updatedCourse, latestNextRaceCourseState)

    yield call(saveCourseToServer, {
      regattaName,
      fleet,
      serverUrl,
      editedCourse: nextCourse,
      existingCourse: latestNextRaceCourseState,
      raceColumnName: nextRaceColumnName,
      raceId: getRaceId(regattaName, nextRaceColumnName),
    })
  }

  const markUsedWithCurrentDeviceAsTracker = compose(
    head,
    filter(compose(find(both(
      propEq('trackingDeviceHash', getHashedDeviceId()),
      compose(isNil, prop('trackingDeviceMappedToMillis')))),
      prop('trackingDevices'))),
    flatten,
    map(prop('markConfigurations')),
    reject(isNil))(
    [updatedCourse])

  if (markUsedWithCurrentDeviceAsTracker) {
    yield put(updateCheckInAndEventInventory({
      leaderboardName,
      markId: markUsedWithCurrentDeviceAsTracker.markId
    }))

    const mark = yield call(api.requestMark, leaderboardName, markUsedWithCurrentDeviceAsTracker.markId, secret)
    yield put(receiveEntities(mark))
  }
  Snackbar.show({
    text: I18n.t('text_course_saved'),
    duration: Snackbar.LENGTH_LONG
  })
  yield call(loadMarkProperties)
}

function* updateMarkPositionFlow({ payload }: any) {
  const { serverUrl, leaderboardName, secret } = yield select(getSelectedRaceInfo)
  const { markConfigurationId, location, bindToThisDevice = false } = payload
  const { markId, markPropertiesId } = yield select(getMarkConfigurationById(markConfigurationId))

  const api = dataApi(serverUrl)

  if (!(yield select(isNetworkConnected))) {
    return
  }

  if (location) {
    const { latitude, longitude } = location
    const updateMarkPropertyCall = markPropertiesId &&
      safeApiCall(api.updateMarkPropertyPositioning, markPropertiesId, undefined, latitude, longitude)

    const updateMarkCall = markId &&
      safeApiCall(api.sendMarkGpsFix, leaderboardName, markId, {
        latitude,
        longitude,
        timestamp: Date.now() * 1000, // timestamp in millis
      }, secret)

    yield all([updateMarkPropertyCall, updateMarkCall])
  } else if (bindToThisDevice) {

  }
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
      passingInstruction: PassingInstruction.Line,
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

function* navigateBackFromCourseCreation({ payload }: any) {
  const hasChanged = yield select(hasEditedCourseChanged)

  if (!hasChanged) {
    payload.navigation.goBack()
    return
  }

  yield call(saveCourseFlow, { navigation: payload.navigation })
}

function* fetchAndUpdateMarkConfigurationDeviceTracking() {
  const selectedMarkConfiguration = yield select(getSelectedMarkConfiguration)
  const markConfiguration = yield select(getMarkConfigurationById(selectedMarkConfiguration))

  if (isNil(markConfiguration.markId)) {
    return
  }

  const { serverUrl, regattaName } = yield select(getSelectedRaceInfo)
  const api = dataApi(serverUrl)
  const allTrackingDevices = yield safe(call(api.requestTrackingDevices, regattaName))

  if (!allTrackingDevices || isEmpty(allTrackingDevices.result)) {
    return
  }

  const trackingDevices = compose(
    prop('deviceStatuses'),
    defaultTo({}),
    findLast(propEq('markId', markConfiguration.markId)),
    defaultTo([]),
    prop('marks'),
    prop('result')
  )(allTrackingDevices)

  if (trackingDevices) {
    yield put(changeMarkConfigurationDeviceTracking({
      trackingDevices,
      id: selectedMarkConfiguration,
    }))
  }
}

export default function* watchCourses() {
  yield all([
    takeLatest(SELECT_COURSE, selectCourseFlow),
    takeEvery(SAVE_COURSE, saveCourseFlow),
    takeLatest(TOGGLE_SAME_START_FINISH, toggleSameStartFinish),
    takeLatest(NAVIGATE_BACK_FROM_COURSE_CREATION, navigateBackFromCourseCreation),
    takeLatest(FETCH_AND_UPDATE_MARK_CONFIGURATION_DEVICE_TRACKING, fetchAndUpdateMarkConfigurationDeviceTracking),
    takeEvery(UPDATE_MARK_POSITION, updateMarkPositionFlow)
  ])
}
