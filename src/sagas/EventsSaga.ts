import { FETCH_COURSES_FOR_EVENT, fetchCoursesForEvent, loadCourse } from 'actions/courses'
import { receiveEntities } from 'actions/entities'
import { ADD_RACE_COLUMNS, CREATE_EVENT, FETCH_RACES_TIMES_FOR_EVENT,
  START_TRACKING, STOP_TRACKING, fetchRacesTimesForEvent, OPEN_EVENT_LEADERBOARD,
  OPEN_SAP_ANALYTICS_EVENT, REMOVE_RACE_COLUMNS, SELECT_EVENT, SET_RACE_TIME,
  START_POLLING_SELECTED_EVENT, STOP_POLLING_SELECTED_EVENT,
  SET_DISCARDS, updateRaceTime, selectEvent, updateCreatingEvent,
  updateSelectingEvent, updateStartingTracking, updateEventPollingStatus, updateEvent } from 'actions/events'
import { fetchRegatta } from 'actions/regattas'
import * as Screens from 'navigation/Screens'
import { UPDATE_EVENT_PERMISSION } from 'actions/permissions'
import { offlineActionTypes } from 'react-native-offline'
import { fetchPermissionsForEvent } from 'actions/permissions'
import { updateCheckIn } from 'actions/checkIn'
import { dataApi } from 'api'
import { openUrl } from 'helpers/utils'
import { safeApiCall } from './HelpersSaga'
import I18n from 'i18n'
import moment from 'moment/min/moment-with-locales'
import { __, apply, compose, concat, curry, dec, path, prop, last, length,
         head, inc, indexOf, map, pick, range, toString, values } from 'ramda'
import { Share, Alert } from 'react-native'
import { all, call, put, select, takeEvery, takeLatest, take, delay } from 'redux-saga/effects'
import { getUserInfo } from 'selectors/auth'
import { getSelectedEventInfo, isPollingEvent, getSelectedEventEndDate, getSelectedEventStartDate, getEventIdThatsBeingSelected } from 'selectors/event'
import { canUpdateEvent } from 'selectors/permissions'
import { isAppActive } from 'selectors/appState'
import { getRegatta, getRegattaNumberOfRaces, getRegattaPlannedRaces } from 'selectors/regatta'
import { isCurrentLeaderboardTracking } from 'selectors/leaderboard'
import { StackActions } from '@react-navigation/native'

const EventPollingInterval = 15000

const valueAtIndex = curry((index, array) => compose(
  head,
  values,
  pick(__, array))(
  [index]))

function eventConfirmationAlert() {
  return new Promise(resolve => {
    Alert.alert(I18n.t('caption_race_set_time'), I18n.t('text_alert_event_time'),
      [ { text: I18n.t('button_proceed'), onPress: () => resolve(true) },
        { text: I18n.t('button_discard'), onPress: () => resolve(false) }
      ])
  })
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

  // Only update race times that have valid data from the API
  // This prevents overwriting locally-set times with null/undefined
  // when the API call fails or returns empty data
  yield all(raceTimes
    .filter((raceTime: object | null | undefined) => raceTime != null)
    .map((raceTime: object, index: number) => {
      // Find the original index since we filtered
      const originalIndex = raceTimes.indexOf(raceTime)
      return put(updateRaceTime({
        [`${payload.leaderboardName}-${races[originalIndex]}`]: raceTime
      }))
    }))
}

function* fetchCoursesForCurrrentEvent({ payload }: any) {
  const api = dataApi(payload.serverUrl)
  const races = yield select(getRegattaPlannedRaces(payload.regattaName))

  const raceCourses = yield all(races.map((raceName: string) =>
    safeApiCall(api.requestCourse, payload.regattaName, raceName, 'Default')
  ))

  // Only update courses that have valid data from the API
  // This prevents overwriting locally-cached courses with null/undefined
  yield all(raceCourses
    .filter((course: object | null | undefined) => course != null)
    .map((course: object, index: number) => {
      const originalIndex = raceCourses.indexOf(course)
      return put(loadCourse({
        raceId: `${payload.regattaName} - ${races[originalIndex]}`,
        course
      }))
    }))
}

function* setRaceTime({ payload }: any) {
  const { race, raceTime, value } = payload
  const date = moment(value).valueOf()
  const { leaderboardName, serverUrl, regattaName, eventId } = yield select(getSelectedEventInfo)
  const eventEndDate = yield select(getSelectedEventEndDate)
  const eventStartDate = yield select(getSelectedEventStartDate)
  const api = dataApi(serverUrl)

  if (eventEndDate < date ||
    eventStartDate > date)
  {
    // wait to make sure time picker is dismissed
    yield delay(500)
    const proceed = yield call(eventConfirmationAlert)
    if (!proceed) {
      return
    }

    if (eventEndDate < date) {
      // update event end time - API call first, then update Redux only on success
      const eventUpdateResult = yield safeApiCall(api.updateEvent(eventId, { enddateasmillis: date }))
      if (eventUpdateResult !== undefined) {
        yield put(updateEvent({id: eventId, data: { endDate: date }}))
      } else {
        console.warn('Failed to update event end date')
        return
      }
    } else {
      // update event start time - API call first, then update Redux only on success
      const eventUpdateResult = yield safeApiCall(api.updateEvent(eventId, { startdateasmillis: date }))
      if (eventUpdateResult !== undefined) {
        yield put(updateEvent({id: eventId, data: { startDate: date }}))
      } else {
        console.warn('Failed to update event start date')
        return
      }
    }

  }

  // Optimistically update Redux first for immediate UI feedback
  yield put(updateRaceTime({
    [`${leaderboardName}-${race}`]: { ...raceTime, startTimeAsMillis: date }
  }))

  const { username } = yield select(getUserInfo)

  const result = yield safeApiCall(api.updateRaceTime, leaderboardName, race, 'Default', {
    authorName: username,
    authorPriority: 3,
    passId: 0,
    startTime: date,
    startProcedureType: 'BASIC'
  })

  // If the API call failed, revert the optimistic update
  if (!result) {
    yield put(updateRaceTime({
      [`${leaderboardName}-${race}`]: raceTime
    }))
    return
  }

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

  const updateResult = yield safeApiCall(api.updateLeaderboard, leaderboardName, {
    resultDiscardingThresholds: discards
  })

  if (updateResult === undefined) {
    console.warn('Failed to update leaderboard discards')
    return
  }

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }
}

function* createEvent(payload: any) {
  const data = payload?.payload?.payload
  if (!data) return

  const { eventId, leaderboardName, secret, serverUrl, numberOfRaces, regattaName } = data
  const navigation = payload?.payload?.navigation
  const api = dataApi(serverUrl)
  const races = compose(
    map(compose(concat('R'), toString)),
    range(1),
    inc)(
    numberOfRaces)
  const regatta = yield select(getRegatta(regattaName))

  yield call(api.updateRegatta, regattaName, {
    controlTrackingFromStartAndFinishTimes: true,
    useStartTimeInference: false,
    defaultCourseAreaUuid: regatta?.courseAreaIds ? head(regatta.courseAreaIds) : undefined,
    autoRestartTrackingUponCompetitorSetChange: true,
  })
  yield all(races.map(race =>
    call(api.denoteRaceForTracking, leaderboardName, race, 'Default')))
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

  // Track denote results to identify failures
  const denoteResults = yield all(races.map(race =>
    safeApiCall(api.denoteRaceForTracking, payload.leaderboardName, race, 'Default')))

  const failedDenotes = races.filter((_: string, idx: number) => !denoteResults[idx])
  if (failedDenotes.length > 0) {
    console.warn('Failed to denote races for tracking:', failedDenotes)
  }

  if (yield select(isCurrentLeaderboardTracking)) {
    const trackingResults = yield all(races.map((race: string) =>
      safeApiCall(api.startTracking, payload.leaderboardName, {
        race_column: race,
        fleet: 'Default'
      })))

    const failedTracking = races.filter((_: string, idx: number) => !trackingResults[idx])
    if (failedTracking.length > 0) {
      console.warn('Failed to start tracking for races:', failedTracking)
    }
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

  const regattaData = entities?.entities?.regatta?.[payload.regattaName]
  const numberOfRaces = regattaData ? getRegattaNumberOfRaces(regattaData) : 0

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
  setTimeout(() => Share.share({
    title: I18n.t('text_share_session_sap_event_header', { regattaName }),
    message: I18n.t('text_share_session_sap_event_message', {
        regattaName,
        link: `${serverUrl}/gwt/Home.html#/event/:eventId=${eventId}` }),
  }), 1)
}

function* startTracking({ payload }: any) {
  const { regattaName, serverUrl, leaderboardName } = payload
  const api = dataApi(serverUrl)
  const races = yield select(getRegattaPlannedRaces(regattaName))

  // Track results to identify failures
  const trackingResults = yield all(races.map((race: string) =>
    safeApiCall(api.startTracking, leaderboardName, {
      race_column: race,
      fleet: 'Default'
    })))

  const failedRaces = races.filter((_: string, idx: number) => !trackingResults[idx])
  if (failedRaces.length > 0) {
    console.warn('Failed to start tracking for races:', failedRaces)
  }

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }

  yield put(updateStartingTracking(false))
}

function* stopTracking({ payload }: any) {
  const { serverUrl, leaderboardName, regattaName } = payload
  const api = dataApi(serverUrl)

  yield safeApiCall(api.stopTracking, leaderboardName, { fleet: 'Default' })

  // Set end of tracking time for the last race
  const races = yield select(getRegattaPlannedRaces(regattaName))
  const lastRace = last(races)

  yield safeApiCall(api.setTrackingTimes, regattaName,
    {
      fleet: 'Default',
      race_column: lastRace,
      endoftrackingasmillis: moment().valueOf()
    })

  const leaderboardData = yield safeApiCall(api.requestLeaderboardV2, leaderboardName)
  if (leaderboardData) {
    yield put(receiveEntities(leaderboardData))
  }
}

function* handleSelectedEventPolling() {
  let isPolling = yield select(isPollingEvent())
  if (!isPolling) {
    isPolling = true
    yield put(updateEventPollingStatus(true))

    while (true && isPolling)
    {
      const isForeground = yield select(isAppActive())
      if (isForeground) {
        const eventData = yield select(getSelectedEventInfo)
        const { regattaName, secret, serverUrl } = eventData
        yield put(fetchRegatta(regattaName, secret, serverUrl))
        yield put(fetchRacesTimesForEvent(eventData))
      }

      yield delay(EventPollingInterval)
      isPolling = yield select(isPollingEvent())
    }
  }
}

function* startPollingSelectedEvent() {
  yield call(handleSelectedEventPolling)
}

function* stopPollingSelectedEvent() {
  yield put(updateEventPollingStatus(false))
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
    yield takeLatest(START_POLLING_SELECTED_EVENT, startPollingSelectedEvent)
    yield takeLatest(STOP_POLLING_SELECTED_EVENT, stopPollingSelectedEvent)
}
