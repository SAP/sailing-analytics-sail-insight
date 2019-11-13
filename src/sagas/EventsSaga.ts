import { when, isEmpty, always, prop, compose,
  isNil, map, range, inc, concat, toString, __,
  apply } from 'ramda'
import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import { CREATE_EVENT, SELECT_EVENT, SET_RACE_TIME, ADD_RACE_COLUMNS } from 'actions/events'
import { getSelectedEventInfo } from 'selectors/event'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getUserInfo } from 'selectors/auth'

import { loadCourse } from 'actions/courses'
import { updateRaceTime } from 'actions/events'

import { dataApi } from 'api'
import moment from 'moment/min/moment-with-locales'

function* selectEventFlow({ payload }: any) {
  const { serverUrl, regattaName } = yield select(getSelectedEventInfo)
  const api = dataApi(serverUrl)

  const races = yield select(getRegattaPlannedRaces(regattaName))
  
  const raceCourses = yield all(races.map((raceName: string) =>
    call(api.requestCourse, regattaName, raceName, 'Default')
  ))

  const raceTimes = yield all(races.map((raceName: string) =>
    call(api.requestRaceTime, payload.leaderboardName, raceName, 'Default')))

  yield all(raceTimes.map((raceTime: object, index: number) => put(updateRaceTime({
    [`${payload.leaderboardName}-${races[index]}`]: raceTime
  }))))

  yield all(raceCourses.map((course: object, index: number) => put(loadCourse({
    [`${regattaName} - ${races[index]}`]: when(compose(isEmpty, prop('waypoints')), always(null), course)
  }))))
}

function* setRaceTime({ payload }: any) {
  const { race, raceTime, value } = payload
  const [hours, minutes] = value.split(':')

  const date = compose(
    d => d.startOf('day').set({ hours, minutes }).valueOf(),
    moment,
    when(isNil, always(new Date())))(
    payload.raceTime.startTimeAsMillis)

  const { leaderboardName, serverUrl } = yield select(getSelectedEventInfo)
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

  yield all(races.map(race =>
      call(api.startTracking, data.leaderboardName, {
        race_column: race,
        fleet: 'Default'
    })))
}

function* addRaceColumns({ payload }: any) {
  console.log('add race columns', payload)
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
}

export default function* watchEvents() {
    yield takeLatest(SELECT_EVENT, selectEventFlow)
    yield takeEvery(SET_RACE_TIME, setRaceTime)
    yield takeEvery(CREATE_EVENT, createEvent)
    yield takeEvery(ADD_RACE_COLUMNS, addRaceColumns)
}
