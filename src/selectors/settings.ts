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

export const getLeaderboardEnabledSetting = (state: RootState = {}) =>
  state.settings && state.settings.leaderboardEnabled

export const IsDefaultServerUrlSettingUsed = (state: RootState = {}) => {
  const serverUrl = getServerUrlSetting(state)
  if (serverUrl && serverUrl !== DEFAULT_SERVER_URL) {
    return false
  }
  return true
}
