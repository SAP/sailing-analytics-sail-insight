import { when, always, compose, isNil, map, range,
  inc, concat, toString, __, apply } from 'ramda'
import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import { CREATE_EVENT, SELECT_EVENT, SET_RACE_TIME,
  ADD_RACE_COLUMNS, REMOVE_RACE_COLUMNS } from 'actions/events'
import { receiveEntities } from 'actions/entities'
import { getSelectedEventInfo } from 'selectors/event'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getUserInfo } from 'selectors/auth'
import { canUpdateEvent } from 'selectors/permissions'
import { loadCourse, fetchCoursesForEvent, FETCH_COURSES_FOR_EVENT } from 'actions/courses'
import { updateRaceTime, fetchRacesTimesForEvent, FETCH_RACES_TIMES_FOR_EVENT } from 'actions/events'
import { fetchPermissionsForEvent } from 'actions/permissions'
import { dataApi } from 'api'
import moment from 'moment/min/moment-with-locales'

function* selectEventFlow({ payload }: any) {
  yield put(fetchPermissionsForEvent(payload))

  const currentUserCanUpdateEvent = yield select(canUpdateEvent(payload.eventId))

  yield put(fetchRacesTimesForEvent(payload))

  if (currentUserCanUpdateEvent) {
    yield put(fetchCoursesForEvent(payload))
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
  const [hours, minutes] = value.split(':')

  const date = compose(
    d => d.startOf('day').set({ hours, minutes }).valueOf(),
    moment,
    when(isNil, always(new Date())))(
    payload.raceTime.startTimeAsMillis)

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

  yield call(api.updateRegatta, data.regattaName,
    { controlTrackingFromStartAndFinishTimes: true,
      useStartTimeInference: false })

  yield all(races.map(race =>
    call(api.denoteRaceForTracking, data.leaderboardName, race, 'Default')))
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
        fleet: 'Default'
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

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventFlow)
    yield takeLatest(FETCH_RACES_TIMES_FOR_EVENT, fetchRacesTimesForCurrentEvent)
    yield takeLatest(FETCH_COURSES_FOR_EVENT, fetchCoursesForCurrrentEvent)
    yield takeEvery(SET_RACE_TIME, setRaceTime)
    yield takeEvery(CREATE_EVENT, createEvent)
    yield takeEvery(ADD_RACE_COLUMNS, addRaceColumns)
    yield takeEvery(REMOVE_RACE_COLUMNS, removeRaceColumns)
}
