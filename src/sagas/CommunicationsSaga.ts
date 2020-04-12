import {
  FETCH_COMMUNICATION_INFO,
  FETCH_COMMUNICATION_STATE,
  fetchCommunicationState,
  SET_COMMUNICATION_STATE,
  START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  UPDATE_SERVER_STATE,
  UPDATE_START_LINE,
  UPDATE_START_LINE_FOR_CURRENT_COURSE,
  updateExpeditionCommunicationMessages,
  updateServerIP,
  updateServerPort,
  updateServerProtocol,
  updateServerState,
  updateServerValid,
  updateStartLine,
} from 'actions/communications'
import { getMarkPositionsForCourse, getServerIP, getServerPort, getStartLine } from 'selectors/communications'
import { getMtcpAndCommunicationSetting } from 'selectors/settings'
import { getServerState, sendStartLine, setServerState } from 'services/CommunicationService'

import { NetworkInfo } from 'react-native-network-info'
import { takeLatest, all, call, put, select, take } from 'redux-saga/effects'
import { dataApi } from 'api'
import { Server1Protocol } from 'sail-insight-expedition-communication'
import { eventChannel } from 'redux-saga'
import { NativeEventEmitter, NativeModules } from 'react-native'

const Server1Port = 8001

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
}

export function* updateStartLineForCurrentCourseSaga({ payload }: any) {

  const communicationEnabled = yield select(getMtcpAndCommunicationSetting)

  if (communicationEnabled) {
    const { raceName, regattaName, serverUrl } = payload
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

function* handleExpeditionCommunicationMessages() {
  const channel = eventChannel(listener => {
    const handleNewMessage = (newMessage: string) => {
      listener(newMessage)
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.SailInsightExpeditionCommunication)
    eventEmitter.addListener('expedition.communication', (event) => {
      console.log(event.message)
      handleNewMessage(event.message)
    })
    return () => {
      eventEmitter.removeListener('expedition.communication', handleNewMessage)
    }
  })
  while (true) {
    const expeditionMessage = yield take(channel)
    yield put(updateExpeditionCommunicationMessages(expeditionMessage))
  }
}

export function* communicationChannelSaga() {
  try {
    yield call(handleExpeditionCommunicationMessages)
  } catch (e) {
    // console.log(e)
  }
}

export default function* watchCommunications() {
  yield all([
    takeLatest(UPDATE_START_LINE, updateStartLineSaga),
    takeLatest(UPDATE_SERVER_STATE, updateServerStateSaga),
    takeLatest(UPDATE_START_LINE_FOR_CURRENT_COURSE, updateStartLineForCurrentCourseSaga),
    takeLatest(FETCH_COMMUNICATION_INFO, fetchCommunicationInfoSaga),
    takeLatest(FETCH_COMMUNICATION_STATE, fetchCommunicationStateSaga),
    takeLatest(SET_COMMUNICATION_STATE, setCommunicationStateSage),
    takeLatest(START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, communicationChannelSaga),
  ])
}
