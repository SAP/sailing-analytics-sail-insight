import { FETCH_COURSES_FOR_EVENT, fetchCoursesForEvent, loadCourse } from 'actions/courses'
import { receiveEntities } from 'actions/entities'
import { ADD_RACE_COLUMNS, CREATE_EVENT, FETCH_RACES_TIMES_FOR_EVENT,
         fetchRacesTimesForEvent, OPEN_EVENT_LEADERBOARD, OPEN_SAP_ANALYTICS_EVENT,
         REMOVE_RACE_COLUMNS, SELECT_EVENT, SET_RACE_TIME, updateRaceTime } from 'actions/events'
import { fetchPermissionsForEvent } from 'actions/permissions'
import { dataApi } from 'api'
import { openUrl } from 'helpers/utils'
import I18n from 'i18n'
import moment from 'moment/min/moment-with-locales'
import { navigateToSessionDetail, navigateToSessionDetail4Organizer } from 'navigation'
import { __, apply, compose, concat, curry, dec,
         head, inc, indexOf, map, pick, range, toString, values } from 'ramda'
import { Share } from 'react-native'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { getUserInfo } from 'selectors/auth'
import { getSelectedEventInfo } from 'selectors/event'
import { canUpdateEvent } from 'selectors/permissions'
import { getRegatta, getRegattaPlannedRaces } from 'selectors/regatta'

const valueAtIndex = curry((index, array) => compose(
  head,
  values,
  pick(__, array))(
  [index]))

function* selectEventFlow({ payload }: any) {
  yield put(fetchPermissionsForEvent(payload))

  const currentUserCanUpdateEvent = yield select(canUpdateEvent(payload.eventId))

  yield put(fetchRacesTimesForEvent(payload))

  if (currentUserCanUpdateEvent) {
    yield put(fetchCoursesForEvent(payload))
    //navigateToSessionDetail4Organizer(payload.leaderboardName)
    navigateToSessionDetail(payload.leaderboardName)
  } else {
    navigateToSessionDetail(payload.leaderboardName)
  }
}

function* fetchRacesTimesForCurrentEvent({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = yield select(getRegattaPlannedRaces(payload.regattaName))

  const raceTimes = yield all(races.map((raceName: string) =>
    call(api.requestRaceTime, payload.leaderboardName, raceName, 'Default')))

  yield all(raceTimes.map((raceTime: object, index: number) => put(updateRaceTime({
    [`${payload.leaderboardName}-${races[index]}`]: raceTime
  }))))
}

function* fetchCoursesForCurrrentEvent({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = yield select(getRegattaPlannedRaces(payload.regattaName))

  const raceCourses = yield all(races.map((raceName: string) =>
    call(api.requestCourse, payload.regattaName, raceName, 'Default')
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

  yield call(api.updateRaceTime, leaderboardName, race, 'Default', {
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
    yield call(api.setTrackingTimes, regattaName,
      {
        fleet: 'Default',
        race_column: previousRace,
        endoftrackingasmillis: moment(date).subtract(1, 'minutes').valueOf()
      })
  }

  try {
    yield all(races.map((race: string) =>
      call(api.startTracking, leaderboardName, {
        race_column: race,
        fleet: 'Default'
    })))
  } catch {}
}

function* createEvent({ payload: { payload: data} }: any) {
  const api = dataApi(data.serverUrl)

  const races = compose(
    map(compose(concat('R'), toString)),
    range(1),
    inc)(
    data.numberOfRaces)

  const regatta = yield select(getRegatta(data.regattaName))

  yield call(api.updateRegatta, data.regattaName,
    { controlTrackingFromStartAndFinishTimes: true,
      useStartTimeInference: false,
      defaultCourseAreaUuid: regatta.courseAreaId })

  yield all(races.map(race =>
    call(api.denoteRaceForTracking, data.leaderboardName, race, 'Default')))

  yield call(selectEventFlow, { payload: data })
}

function* addRaceColumns({ payload }: any) {
  const api = dataApi(payload.serverUrl)

  yield call(api.addRaceColumns, payload.regattaName, payload)

  const races = compose(
    map(compose(concat('R'), toString)),
    apply(range),
    map(inc))(
    [payload.existingNumberOfRaces, payload.existingNumberOfRaces + payload.numberofraces])

    yield all(races.map((race: string) =>
      call(api.startTracking, payload.leaderboardName, {
        race_column: race,
        fleet: 'Default',
        trackedRaceName: race
    })))

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
      call(api.removeRaceColumn, payload.regattaName, race)))

    yield call(reloadRegattaAfterRaceColumnsChange, payload)
}

function* reloadRegattaAfterRaceColumnsChange(payload: any) {
  const api = dataApi(payload.serverUrl)
  const entities = yield call(api.requestRegatta, payload.regattaName)

  yield put(receiveEntities(entities))
}

function* openEventLeaderboard() {
  const { serverUrl, eventId, regattaName } = yield select(getSelectedEventInfo)

  openUrl(`${serverUrl}/gwt/Home.html#/regatta/minileaderboard/:eventId=${eventId}&regattaId=${regattaName}`)
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

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventFlow)
    yield takeLatest(FETCH_RACES_TIMES_FOR_EVENT, fetchRacesTimesForCurrentEvent)
    yield takeLatest(FETCH_COURSES_FOR_EVENT, fetchCoursesForCurrrentEvent)
    yield takeEvery(SET_RACE_TIME, setRaceTime)
    yield takeEvery(CREATE_EVENT, createEvent)
    yield takeEvery(ADD_RACE_COLUMNS, addRaceColumns)
    yield takeEvery(REMOVE_RACE_COLUMNS, removeRaceColumns)
    yield takeLatest(OPEN_EVENT_LEADERBOARD, openEventLeaderboard)
    yield takeLatest(OPEN_SAP_ANALYTICS_EVENT, openSAPAnalyticsEvent)
}
