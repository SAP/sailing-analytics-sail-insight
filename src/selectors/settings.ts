import { RootState } from 'reducers/config'
import { DEFAULT_SERVER_URL, DEFAULT_SERVER_ANY_URL } from '../environment/init'


export const getBulkGpsSetting = (state: RootState = {}) =>
  state.settings && state.settings.bulkGpsUpdate

export const getEnableAnalyticsSettings = (state: RootState = {}) =>
  state.settings && state.settings.enableAnalytics

export const getServerUrlSetting = (state: RootState = {}) =>
  state.settings && state.settings.serverUrl

export const getVerboseLoggingSetting = (state: RootState = {}) =>
  state.settings && state.settings.verboseLogging

export const getCommunicationSetting = (state: RootState = {}) =>
  state.settings && state.settings.communicationEnabled

export const getLeaderboardEnabledSetting = (state: RootState = {}) => true
  //state.settings && state.settings.leaderboardEnabled

export const getServerProxyUrlSetting = (state: RootState = {}) =>
  state.settings && state.settings.proxyUrl

export const getMasterUdpIP = (state: RootState = {}) =>
  state.settings && state.settings.masterUdpIP

export const getMasterUdpPort = (state: RootState = {}) =>
  state.settings && state.settings.masterUdpPort && state.settings.serverUrl &&
  state.settings.masterUdpPort[state.settings.serverUrl] || state.settings.masterUdpPort[DEFAULT_SERVER_ANY_URL]

export const getMasterUdpPorts = (state: RootState = {}) =>
  state.settings && state.settings.masterUdpPort

export const getDefaultAnyServerUrl = () => {
  return DEFAULT_SERVER_ANY_URL
}
