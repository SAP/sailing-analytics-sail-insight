import crashlytics from '@react-native-firebase/crashlytics'
import { FETCH_COURSES_FOR_EVENT, fetchCoursesForEvent, loadCourse } from 'actions/courses'
import { receiveEntities } from 'actions/entities'
import { ADD_RACE_COLUMNS, CREATE_EVENT, FETCH_RACES_TIMES_FOR_EVENT,
  START_TRACKING, STOP_TRACKING, fetchRacesTimesForEvent, OPEN_EVENT_LEADERBOARD,
  OPEN_SAP_ANALYTICS_EVENT, REMOVE_RACE_COLUMNS, SELECT_EVENT, SET_RACE_TIME,
  SET_DISCARDS, updateRaceTime, selectEvent, updateCreatingEvent,
  updateSelectingEvent, updateStartingTracking } from 'actions/events'
import { fetchRegatta } from 'actions/regattas'
import * as Screens from 'navigation/Screens'
import { UPDATE_EVENT_PERMISSION } from 'actions/permissions'
import { offlineActionTypes } from 'react-native-offline'
import { fetchPermissionsForEvent } from 'actions/permissions'
import { updateCheckIn } from 'actions/checkIn'
import { dataApi } from 'api'
import { openUrl } from 'helpers/utils'
import I18n from 'i18n'
import moment from 'moment/min/moment-with-locales'
import { __, apply, compose, concat, curry, dec, path, prop, length,
         head, inc, indexOf, map, pick, range, toString, values } from 'ramda'
import { Share } from 'react-native'
import { all, call, put, select, takeEvery, takeLatest, take } from 'redux-saga/effects'
import { getUserInfo } from 'selectors/auth'
import { getSelectedEventInfo } from 'selectors/event'
import { canUpdateEvent } from 'selectors/permissions'
import { getRegatta, getRegattaPlannedRaces } from 'selectors/regatta'
import { isCurrentLeaderboardTracking } from 'selectors/leaderboard'
import { StackActions } from '@react-navigation/native'

const valueAtIndex = curry((index, array) => compose(
  head,
  values,
  pick(__, array))(
  [index]))

function* safeApiCall(method, ...args) {
  let result

  try {
    result = yield call(method, ...args)
  } catch (e) {
    crashlytics().setAttribute('saga', 'true')
    crashlytics().recordError(e)
  }

  return result
}

function* selectEventSaga({ payload }: any) {
  const eventData = payload.data
  const navigation = payload.navigation
  const replaceCurrentScreen = payload.replaceCurrentScreen

  yield put(fetchPermissionsForEvent(eventData))
  yield take([UPDATE_EVENT_PERMISSION, offlineActionTypes.FETCH_OFFLINE_MODE])

  const currentUserCanUpdateEvent = yield select(canUpdateEvent(eventData.eventId))
  const { regattaName, secret, serverUrl } = eventData

  yield put(fetchRegatta(regattaName, secret, serverUrl))
  yield put(fetchRacesTimesForEvent(eventData))

  if (currentUserCanUpdateEvent) {
    yield call(fetchCoursesForCurrrentEvent, { payload: eventData })
    if (replaceCurrentScreen) {
      navigation.dispatch(StackActions.replace(Screens.SessionDetail4Organizer, { data: eventData }))
    } else {
      navigation.navigate(Screens.SessionDetail4Organizer, { data: eventData })
    }
  } else {
    navigation.navigate(Screens.SessionDetail, { data: eventData })
  }
  yield put(updateCreatingEvent(false))
  yield put(updateSelectingEvent(false))
}

function* fetchRacesTimesForCurrentEvent({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = yield select(getRegattaPlannedRaces(payload.regattaName))

  const raceTimes = yield all(races.map((raceName: string) =>
    safeApiCall(api.requestRaceTime, payload.leaderboardName, raceName, 'Default')))

  yield all(raceTimes.map((raceTime: object, index: number) => put(updateRaceTime({
    [`${payload.leaderboardName}-${races[index]}`]: raceTime
  }))))
}

function* fetchCoursesForCurrrentEvent({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = yield select(getRegattaPlannedRaces(payload.regattaName))

  const raceCourses = yield all(races.map((raceName: string) =>
    safeApiCall(api.requestCourse, payload.regattaName, raceName, 'Default')
  ))

  yield all(raceCourses.map((course: object, index: number) =>
    put(loadCourse({
      raceId: `${payload.regattaName} - ${races[index]}`,
      course
    }))
  ))
}

function* setRaceTime({ payload }: any) {
  const { race, raceTime, value } = payload
  const date = moment(value).valueOf()
  const { leaderboardName, serverUrl, regattaName } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  yield put(updateRaceTime({
    [`${leaderboardName}-${race}`]: { ...raceTime, startTimeAsMillis: date }
  }))

  const { username } = yield select(getUserInfo)

  yield safeApiCall(api.updateRaceTime, leaderboardName, race, 'Default', {
    authorName: username,
    authorPriority: 3,
    passId: 0,
    startTime: date,
    startProcedureType: 'BASIC'
  })

  const races = yield select(getRegattaPlannedRaces(regattaName))
  const previousRace = compose(
    valueAtIndex(__, races),
    dec,
    indexOf(race))(
    races)

  if (previousRace) {
    yield safeApiCall(api.setTrackingTimes, regattaName,
      {
        fleet: 'Default',
        race_column: previousRace,
        endoftrackingasmillis: moment(date).subtract(1, 'minutes').valueOf()
      })
  }
}

function* setDiscards({ payload }: any) {
  const { discards, session } = payload
  const { leaderboardName, serverUrl } = session
  const api = dataApi(serverUrl)

  yield safeApiCall(api.updateLeaderboard, leaderboardName, {
    resultDiscardingThresholds: discards
  })

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }
}

function* createEvent(payload: object) {
  const data = payload.payload.payload
  const navigation = payload.payload.navigation
  const api = dataApi(data.serverUrl)
  const races = compose(
    map(compose(concat('R'), toString)),
    range(1),
    inc)(
    data.numberOfRaces)
  const regatta = yield select(getRegatta(data.regattaName))

  console.log('create event', payload)

  yield call(api.updateRegatta, data.regattaName,
    { controlTrackingFromStartAndFinishTimes: true,
      useStartTimeInference: false,
      defaultCourseAreaUuid: regatta.courseAreaId,
      autoRestartTrackingUponCompetitorSetChange: true,
    })
  yield all(races.map(race =>
    call(api.denoteRaceForTracking, data.leaderboardName, race, 'Default')))
  yield put(selectEvent({ data, replaceCurrentScreen: true, navigation }))
}

function* addRaceColumns({ payload }: any) {
  const api = dataApi(payload.serverUrl)

  yield call(api.addRaceColumns, payload.regattaName, payload)

  const races = compose(
    map(compose(concat('R'), toString)),
    apply(range),
    map(inc))(
    [payload.existingNumberOfRaces, payload.existingNumberOfRaces + payload.numberofraces])

  yield all(races.map(race =>
    safeApiCall(api.denoteRaceForTracking, payload.leaderboardName, race, 'Default')))

  if (yield select(isCurrentLeaderboardTracking)) {
    yield all(races.map((race: string) =>
    safeApiCall(api.startTracking, payload.leaderboardName, {
      race_column: race,
      fleet: 'Default'
    })))
  }

  yield call(reloadRegattaAfterRaceColumnsChange, payload)
}

function* removeRaceColumns({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = compose(
    map(compose(concat('R'), toString)),
    apply(range),
    map(inc))(
    [payload.existingNumberOfRaces - payload.numberofraces, payload.existingNumberOfRaces])

  yield all(races.map((race: string) =>
    safeApiCall(api.removeRaceColumn, payload.regattaName, race)))
  yield call(reloadRegattaAfterRaceColumnsChange, payload)
}

function* reloadRegattaAfterRaceColumnsChange(payload: any) {
  const api = dataApi(payload.serverUrl)
  const entities = yield call(api.requestRegatta, payload.regattaName)

  const numberOfRaces = compose(
    length,
    prop('races'),
    head,
    path(['entities', 'regatta', payload.regattaName, 'series']))(
    entities)

  yield put(updateCheckIn({
    leaderboardName: payload.leaderboardName,
    numberOfRaces
  }))
  yield put(receiveEntities(entities))
}

function* openEventLeaderboard() {
  const { serverUrl, eventId, regattaName } = yield select(getSelectedEventInfo)
  const urlEventLeaderBoard = `${serverUrl}/gwt/Home.html#/regatta/minileaderboard/:eventId=${eventId}&regattaId=` + encodeURIComponent(regattaName);

  openUrl(urlEventLeaderBoard);
}

function* openSAPAnalyticsEvent() {
  const { serverUrl, eventId, regattaName } = yield select(getSelectedEventInfo)

  Share.share({
    title: I18n.t('text_share_session_sap_event_header', { regattaName }),
    message: I18n.t('text_share_session_sap_event_message', {
        regattaName,
        link: `${serverUrl}/gwt/Home.html#/event/:eventId=${eventId}` }),
  })
}

function* startTracking({ payload }: any) {
  const { regattaName, serverUrl, leaderboardName } = payload
  const api = dataApi(serverUrl)
  const races = yield select(getRegattaPlannedRaces(regattaName))

  yield all(races.map((race: string) =>
    safeApiCall(api.startTracking, leaderboardName, {
      race_column: race,
      fleet: 'Default'
  })))

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }

  yield put(updateStartingTracking(false))
}

function* stopTracking({ payload }: any) {
  const { serverUrl, leaderboardName } = payload
  const api = dataApi(serverUrl)

  yield safeApiCall(api.stopTracking, leaderboardName, { fleet: 'Default' })

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }
}

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventSaga)
    yield takeLatest(FETCH_RACES_TIMES_FOR_EVENT, fetchRacesTimesForCurrentEvent)
    yield takeLatest(FETCH_COURSES_FOR_EVENT, fetchCoursesForCurrrentEvent)
    yield takeEvery(SET_RACE_TIME, setRaceTime)
    yield takeEvery(CREATE_EVENT, createEvent)
    yield takeEvery(ADD_RACE_COLUMNS, addRaceColumns)
    yield takeEvery(REMOVE_RACE_COLUMNS, removeRaceColumns)
    yield takeEvery(SET_DISCARDS, setDiscards)
    yield takeLatest(OPEN_EVENT_LEADERBOARD, openEventLeaderboard)
    yield takeLatest(OPEN_SAP_ANALYTICS_EVENT, openSAPAnalyticsEvent)
    yield takeLatest(START_TRACKING, startTracking)
    yield takeLatest(STOP_TRACKING, stopTracking)
}
