import { UPDATE_COMMUNICATION_SETTINGS } from 'actions/settings'
import { updateSettings as updateSettingsCommunication } from 'services/CommunicationService'
import { updateSettings as updateSettingsMtcp } from 'services/MtcpService'


import { takeLatest, all, select} from 'redux-saga/effects'
import { getServerProxyUrlSetting, getMasterUdpIP, getMasterUdpPort } from 'selectors/settings'

export function* updateCommunicationSettings({payload}: any) {

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

export default function* watchSettings() {
  yield all([
    takeLatest(UPDATE_COMMUNICATION_SETTINGS, updateCommunicationSettings),
  ])
}