import { UPDATE_START_LINE } from 'actions/communications'
import { sendServerMessage } from 'services/CommunicationService'

import { takeLatest, all} from 'redux-saga/effects'

export function* updateStartLine({ payload }: any) {

  //#L,P,16.9897166666667,-61.7854166666667*3F
  //#L,P,16.9903666666667,-61.7697833333333*3E

  const startPin = `#L,P,${payload.pinLatitude},${payload.pinLongitude}*3F`
  const startBoat = `#L,P,${payload.pinLatitude},${payload.pinLongitude}*3E`

  sendServerMessage(startPin)
  sendServerMessage(startBoat)

}

export default function* watchCommunications() {
  yield all([
    takeLatest(UPDATE_START_LINE, updateStartLine)
  ])
}