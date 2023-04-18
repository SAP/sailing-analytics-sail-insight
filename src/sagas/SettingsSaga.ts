import { UPDATE_COMMUNICATION_SETTINGS } from 'actions/settings'
import { updateSettings as updateSettingsCommunication } from 'services/CommunicationService'


import { takeLatest, all, select, call} from 'redux-saga/effects'
import { getServerProxyUrlSetting, getMasterUdpIP, getMasterUdpPort, getCommunicationSetting } from 'selectors/settings'

function* updateCommunicationModuleSettings() {
  const serverProxyUrl = yield select(getServerProxyUrlSetting)
  const serverUdpIP = yield select(getMasterUdpIP)
  const serverUdpPort = yield select(getMasterUdpPort)

  const settingsCommunication = {
    serverProxyUrl,
    serverUdpIP,
    serverUdpPort
  }

  updateSettingsCommunication(settingsCommunication)
}

export function* updateCommunicationSettingsSaga({payload}: any) {
  const communicationEnabled = yield select(getCommunicationSetting)
  if (communicationEnabled) {
  yield call(updateCommunicationModuleSettings)
  }
}

export default function* watchSettings() {
  yield all([
    takeLatest(UPDATE_COMMUNICATION_SETTINGS, updateCommunicationSettingsSaga),
  ])
}
