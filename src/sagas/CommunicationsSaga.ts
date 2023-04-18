import {
  FETCH_COMMUNICATION_INFO,
  FETCH_COMMUNICATION_STATE,
  RESET_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  SET_COMMUNICATION_STATE,
  START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
  STOP_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL,
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
import {all} from 'redux-saga/effects'


export default function* watchCommunications() {
  yield all([
    // takeLatest(UPDATE_START_LINE, updateStartLineSaga),
    // takeLatest(UPDATE_SERVER_STATE, updateServerStateSaga),
    //takeLatest(START_UPDATE_START_LINE_FOR_CURRENT_COURSE, startUpdateStartLineForCurrentCourseSaga),
    //takeLatest(STOP_UPDATE_START_LINE_FOR_CURRENT_COURSE, stopUpdateStartLineForCurrentCourseSaga),
    //takeLatest(FETCH_START_LINE_FOR_CURRENT_COURSE, fetchStartLineForCurrentCourseSaga),
    //takeLatest(FETCH_COMMUNICATION_INFO, fetchCommunicationInfoSaga),
    // takeLatest(FETCH_COMMUNICATION_STATE, fetchCommunicationStateSaga),
    // takeLatest(SET_COMMUNICATION_STATE, setCommunicationStateSage),
    //takeLatest(START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, startCommunicationChannelSaga),
    //takeLatest(STOP_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, stopCommunicationChannel),
    //takeLatest(RESET_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL, resetCommunicationChannelSaga),
    // takeLatest(KEEP_COMMUNICATION_ALIVE, keepCommunicationAliveSaga),
  ])
}
