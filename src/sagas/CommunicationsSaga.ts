import { UPDATE_START_LINE, UPDATE_SERVER_STATE } from 'actions/communications'
import { sendStartLine } from 'services/CommunicationService'

import { takeLatest, all} from 'redux-saga/effects'

export function* updateStartLine({ payload }: any) {
  sendStartLine()
}

export function* updateServerState({payload}: any) {
  if (payload) {
    sendStartLine()
  }
}

export default function* watchCommunications() {
  yield all([
    takeLatest(UPDATE_START_LINE, updateStartLine),
    takeLatest(UPDATE_SERVER_STATE, updateServerState)
  ])
}