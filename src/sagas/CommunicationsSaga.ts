import { UPDATE_START_LINE, UPDATE_SERVER_STATE, UPDATE_START_LINE_FOR_CURRENT_COURSE, FETCH_COMMUNICATION_INFO, FETCH_COMMUNICATION_STATE, SET_COMMUNICATION_STATE, 
  updateStartLine, updateServerValid, updateServerPort, updateServerProtocol, updateServerIP, fetchCommunicationState, updateServerState } from 'actions/communications'
import { sendStartLine, getServerState, setServerState } from 'services/CommunicationService'
import { getMarkPositionsForCourse, getServerIP, getServerPort, getStartLine } from 'selectors/communications'

import { NetworkInfo } from "react-native-network-info"
import { takeLatest, all, call, put, select} from 'redux-saga/effects'
import { dataApi } from 'api'
import { Server1Protocol } from 'sail-insight-expedition-communication'

const Server1Port = 8001

function getNetworkPromise()
{
  return NetworkInfo.getIPV4Address()
}

function getServerStatePromise()
{
  return getServerState()
}

export function* updateStartLineSaga({ payload }: any) {
  const startLine = yield select(getStartLine())

  sendStartLine(startLine)
}

export function* updateServerStateSaga({payload}: any) {
  if (payload) {
    const startLine = yield select(getStartLine())

    sendStartLine(startLine)
  }
}

export function* fetchCommunicationInfoSaga({payload}: any) {
  yield put(updateServerValid(false))
  yield put(updateServerPort(Server1Port))
  yield put(updateServerProtocol(Server1Protocol))
    
  // get wifi address
  const ipWifi = yield call(getNetworkPromise)
  if (ipWifi) {
    yield put(updateServerValid(true))
    yield put(updateServerIP(ipWifi))
  } else {
    yield put(updateServerIP("0.0.0.0"))
  }
  
  // get server state
  yield put(fetchCommunicationState())
}

export function* fetchCommunicationStateSaga({payload}: any) {
  const state = yield call(getServerStatePromise)

  yield put(updateServerState(state))
}

export function* setCommunicationStateSage({payload}: any) {

  const ip = yield select(getServerIP())
  const port = yield select(getServerPort())

  setServerState(payload, ip, port)
  yield put(updateServerState(payload))
}

export function* updateStartLineForCurrentCourseSaga({payload}: any){

  const { raceName, regattaName, serverUrl } = payload
  const api = dataApi(serverUrl)

  const course = yield call(api.requestCourse, regattaName, raceName, 'Default')

  // update start line
  const startLine: any = getMarkPositionsForCourse(course, 'Start')

  if (startLine.length > 1) {
    yield put(updateStartLine({pinLatitude: startLine[0].lat_deg, pinLongitude: startLine[0].lon_deg, boatLatitude: startLine[1].lat_deg, boatLongitude: startLine[1].lon_deg}))
  } else {
    yield put(updateStartLine({}))
  }
}

export default function* watchCommunications() {
  yield all([
    takeLatest(UPDATE_START_LINE, updateStartLineSaga),
    takeLatest(UPDATE_SERVER_STATE, updateServerStateSaga),
    takeLatest(UPDATE_START_LINE_FOR_CURRENT_COURSE, updateStartLineForCurrentCourseSaga),
    takeLatest(FETCH_COMMUNICATION_INFO, fetchCommunicationInfoSaga),
    takeLatest(FETCH_COMMUNICATION_STATE, fetchCommunicationStateSaga),
    takeLatest(SET_COMMUNICATION_STATE, setCommunicationStateSage)
  ])
}