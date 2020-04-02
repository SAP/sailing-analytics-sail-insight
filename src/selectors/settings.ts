import { RootState } from 'reducers/config'
import { DEFAULT_SERVER_URL } from '../environment/init'


export const getBulkGpsSetting = (state: RootState = {}) =>
  state.settings && state.settings.bulkGpsUpdate

export const getEnableAnalyticsSettings = (state: RootState = {}) =>
  state.settings && state.settings.enableAnalytics

export const getServerUrlSetting = (state: RootState = {}) =>
  state.settings && state.settings.serverUrl

export const getVerboseLoggingSetting = (state: RootState = {}) =>
  state.settings && state.settings.verboseLogging

export const getMtcpAndCommunicationSetting = (state: RootState = {}) =>
    state.settings && state.settings.mtcpAndCommunication

export const getLeaderboardEnabledSetting = (state: RootState = {}) => true
  //state.settings && state.settings.leaderboardEnabled

export const getServerProxyUrlSetting = (state: RootState = {}) =>
  state.settings && state.settings.proxyUrl

export const getMasterUdpIP = (state: RootState = {}) =>
  state.settings && state.settings.masterUdpIP

export const getMasterUdpPort = (state: RootState = {}) => {
  if (IsDefaultServerUrlSettingUsed(state)) {
    return state.settings && state.settings.masterUdpPortDefault
  } else {
    return state.settings && state.settings.masterUdpPort
  }
}

export const getMasterUdpPorts = (state: RootState = {}) => {
    return [
      state.settings && state.settings.masterUdpPortDefault, 
      state.settings && state.settings.masterUdpPort 
    ]
}

export const IsDefaultServerUrlSettingUsed = (state: RootState = {}) => {
  const serverUrl = getServerUrlSetting(state)
  if (serverUrl && serverUrl !== DEFAULT_SERVER_URL) {
    return false
  }
  return true
}

export const IsDefaultServerUrl = (serverUrl: string) => {
  return serverUrl && serverUrl === DEFAULT_SERVER_URL
}
