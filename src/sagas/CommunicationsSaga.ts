import {
  FETCH_COMMUNICATION_INFO,
  FETCH_COMMUNICATION_STATE,
  RESET_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  SET_COMMUNICATION_STATE,
  START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  STOP_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  UPDATE_SERVER_STATE,
  UPDATE_START_LINE,
  START_UPDATE_START_LINE_FOR_CURRENT_COURSE,
  STOP_UPDATE_START_LINE_FOR_CURRENT_COURSE,
  FETCH_START_LINE_FOR_CURRENT_COURSE,
  updateExpeditionCommunicationMessages,
  resetExpeditionCommunicationMessages,
  fetchCommunicationState,
  updateServerIP,
  updateServerPort,
  updateServerProtocol,
  updateServerState,
  updateServerValid,
  updateStartLine,
  fetchStartLineForCurrentCourse,
  startUpdateStartLineBasedOnCurrentCourse,
  updateStartLinePollingStatus,
} from 'actions/communications'
import { getMarkPositionsForCourse, getServerIP, getServerPort, getStartLine, getStartLinePollingStatus, getStartLineCourse } from 'selectors/communications'
import { getMtcpAndCommunicationSetting } from 'selectors/settings'
import { getServerState, sendStartLine, setServerState } from 'services/CommunicationService'

import { NetworkInfo } from 'react-native-network-info'
import { takeLatest, all, call, put, select, take, delay } from 'redux-saga/effects'
import { dataApi } from 'api'
import { Server1Protocol } from 'sail-insight-expedition-communication'
import { eventChannel } from 'redux-saga'
import { NativeEventEmitter, NativeModules } from 'react-native'

const Server1Port = 8001
const StartLinePollingInterval = 5000

function getNetworkPromise() {
  return NetworkInfo.getIPV4Address()
}

function getServerStatePromise() {
  return getServerState()
}

function isValidGate(gate: any) {
  if (gate.length > 1) {
    if (gate[0] !== undefined && gate[1] !== undefined &&
      gate[0].lat_deg !== undefined && gate[0].lon_deg !== undefined &&
      gate[1].lat_deg !== undefined && gate[1].lon_deg !== undefined) {
      return true
    }
  }
  return false
}

export function* updateStartLineSaga({ payload }: any) {
  const startLine = yield select(getStartLine())

  sendStartLine(startLine)
}

export function* updateServerStateSaga({ payload }: any) {
  if (payload) {
    const startLine = yield select(getStartLine())

    sendStartLine(startLine)
  }
}

export function* fetchCommunicationInfoSaga({ payload }: any) {
  yield put(updateServerValid(false))
  yield put(updateServerPort(Server1Port))
  yield put(updateServerProtocol(Server1Protocol))

  // get wifi address
  const ipWifi = yield call(getNetworkPromise)
  if (ipWifi) {
    yield put(updateServerValid(true))
    yield put(updateServerIP(ipWifi))
  } else {
    yield put(updateServerIP('0.0.0.0'))
  }

  // get server state
  yield put(fetchCommunicationState())
}

export function* fetchCommunicationStateSaga({ payload }: any) {
  const state = yield call(getServerStatePromise)

  yield put(updateServerState(state))
}

export function* setCommunicationStateSage({ payload }: any) {

  const ip = yield select(getServerIP())
  const port = yield select(getServerPort())

  setServerState(payload, ip, port)
  yield put(updateServerState(payload))

  // start/stop start line updates in case tracking is started before communication module
  if (payload) {
    const isPolling = yield select(getStartLinePollingStatus())
    if (!isPolling) {
      const startLineCourse = yield select(getStartLineCourse())
      yield put(startUpdateStartLineBasedOnCurrentCourse(startLineCourse))
    }
  } else
  {
    yield put(updateStartLinePollingStatus(false))
  }

}

export function* fetchStartLineForCurrentCourseSaga() {

  const payload = yield select(getStartLineCourse())
  const { raceName, regattaName, serverUrl } = payload

  if (raceName  && regattaName && serverUrl) {
    const api = dataApi(serverUrl)

    const course = yield call(api.requestCourse, regattaName, raceName, 'Default')

    // update start line
    const startLine: any = getMarkPositionsForCourse(course, 'Start')

    if (isValidGate(startLine)) {
      yield put(
          updateStartLine({
            pinLatitude: startLine[0].lat_deg,
            pinLongitude: startLine[0].lon_deg,
            boatLatitude: startLine[1].lat_deg,
            boatLongitude: startLine[1].lon_deg,
          }),
      )
    } else {
      yield put(updateStartLine({}))
    }
  }
}

export function* startUpdateStartLineForCurrentCourseSaga() {

  // reset start line
  yield put(updateStartLine({}))

  const communicationEnabled = yield select(getMtcpAndCommunicationSetting)

  if (communicationEnabled) {

    let isPolling = yield select(getStartLinePollingStatus())
    if (!isPolling) {
      isPolling = true
      yield put(updateStartLinePollingStatus(true))

      while (true && isPolling)
      {
        yield put(fetchStartLineForCurrentCourse())
        yield delay(StartLinePollingInterval)
        isPolling = yield select(getStartLinePollingStatus())
      }
    }
  }
}

export function* stopUpdateStartLineForCurrentCourseSaga() {
  yield put(updateStartLinePollingStatus(false))
  yield put(updateStartLine({}))
}


let expeditionCommunicationChannel: any
function* handleExpeditionCommunicationMessages(shouldClearPreviousData: boolean) {
  expeditionCommunicationChannel = eventChannel((listener: any) => {
    const handleEvent = (event: any) => {
      listener(event)
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.SailInsightExpeditionCommunication)
    eventEmitter.addListener('expedition.communication', (event) => {
      handleEvent(event)
    })
    return () => {
      eventEmitter.removeListener('expedition.communication', handleEvent)
    }
  })
  try {
    if (shouldClearPreviousData) {
      yield call(resetExpeditionMessages)
    }
    while (true) {
      const expeditionEvent = yield take(expeditionCommunicationChannel)
      const key = 'timestamp'
      expeditionEvent[key] = Date.now()
      yield put(updateExpeditionCommunicationMessages(expeditionEvent))
    }
  } finally {
    expeditionCommunicationChannel.close()
  }
}

function* resetExpeditionMessages() {
  yield put(resetExpeditionCommunicationMessages())
}

function* startCommunicationChannelSaga({ payload }: any) {
  try {
    yield call(handleExpeditionCommunicationMessages, payload)
  } catch (e) {
    console.log(e)
  }
}

function stopCommunicationChannel() {
  if (expeditionCommunicationChannel) {
    expeditionCommunicationChannel.close()
  }
}

function* resetCommunicationChannelSaga() {
  try {
    yield call(resetExpeditionMessages)
  } catch (e) {
    // console.log(e)
  }
}

export default function* watchCommunications() {
  yield all([
    takeLatest(UPDATE_START_LINE, updateStartLineSaga),
    takeLatest(UPDATE_SERVER_STATE, updateServerStateSaga),
    takeLatest(START_UPDATE_START_LINE_FOR_CURRENT_COURSE, startUpdateStartLineForCurrentCourseSaga),
    takeLatest(STOP_UPDATE_START_LINE_FOR_CURRENT_COURSE, stopUpdateStartLineForCurrentCourseSaga),
    takeLatest(FETCH_START_LINE_FOR_CURRENT_COURSE, fetchStartLineForCurrentCourseSaga),
    takeLatest(FETCH_COMMUNICATION_INFO, fetchCommunicationInfoSaga),
    takeLatest(FETCH_COMMUNICATION_STATE, fetchCommunicationStateSaga),
    takeLatest(SET_COMMUNICATION_STATE, setCommunicationStateSage),
    takeLatest(START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, startCommunicationChannelSaga),
    takeLatest(STOP_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, stopCommunicationChannel),
    takeLatest(RESET_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, resetCommunicationChannelSaga),
  ])
}
