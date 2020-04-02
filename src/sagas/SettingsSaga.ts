import { UPDATE_COMMUNICATION_SETTINGS, UPDATE_MTCP_COMMUNICATION_SETTING } from 'actions/settings'
import { updateSettings as updateSettingsCommunication } from 'services/CommunicationService'
import { updateSettings as updateSettingsMtcp } from 'services/MtcpService'


import { takeLatest, all, select, call} from 'redux-saga/effects'
import { getServerProxyUrlSetting, getMasterUdpIP, getMasterUdpPort } from 'selectors/settings'

function* updateModulesSettings() {
  const serverProxyUrl = yield select(getServerProxyUrlSetting)
  const serverUdpIP = yield select(getMasterUdpIP)
  const serverUdpPort = yield select(getMasterUdpPort)

  const settingsCommunication = {
    serverProxyUrl,
    serverUdpIP,
    serverUdpPort
  }

  updateSettingsCommunication(settingsCommunication)

  const settingsMtcp = {
    serverProxyUrl
  }

  updateSettingsMtcp(settingsMtcp)
}

export function* updateCommunicationSettingsSaga({payload}: any) {
  yield call(updateModulesSettings)
}

export function* updateMtcpCommunicationSettingSaga({payload}: any) {
  if (payload) {
    yield call(updateModulesSettings)
  }
}

export default function* watchSettings() {
  yield all([
    takeLatest(UPDATE_COMMUNICATION_SETTINGS, updateCommunicationSettingsSaga),
    takeLatest(UPDATE_MTCP_COMMUNICATION_SETTING, updateMtcpCommunicationSettingSaga)
  ])
}