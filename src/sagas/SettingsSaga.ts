import { UPDATE_COMMUNICATION_SETTINGS, UPDATE_MTCP_SETTINGS } from 'actions/settings'
import { updateSettings as updateSettingsCommunication } from 'services/CommunicationService'
import { updateSettings as updateSettingsMtcp } from 'services/MtcpService'


import { takeLatest, all, select, call} from 'redux-saga/effects'
import { getServerProxyUrlSetting, getMasterUdpIP, getMasterUdpPort, getMtcpSetting, getCommunicationSetting } from 'selectors/settings'

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

function* updateMtcpModuleSettings() {
  const serverProxyUrl = yield select(getServerProxyUrlSetting)

  const settingsMtcp = {
    serverProxyUrl
  }

  updateSettingsMtcp(settingsMtcp)
}

export function* updateCommunicationSettingsSaga({payload}: any) {
  const communicationEnabled = yield select(getCommunicationSetting)
  if (communicationEnabled) {
  yield call(updateCommunicationModuleSettings)
  }
}

export function* updateMtcpSettingSaga({payload}: any) {
  const mtcpEnabled = yield select(getMtcpSetting)
  if (mtcpEnabled) {
    yield call(updateMtcpModuleSettings)
  }
}

export default function* watchSettings() {
  yield all([
    takeLatest(UPDATE_COMMUNICATION_SETTINGS, updateCommunicationSettingsSaga),
    takeLatest(UPDATE_MTCP_SETTINGS, updateMtcpSettingSaga)
  ])
}