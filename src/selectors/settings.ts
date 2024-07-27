import { RootState } from 'reducers/config'


export const getBulkGpsSetting = (state: RootState = {}) =>
  state.settings && state.settings.bulkGpsUpdate

export const getEnableAnalyticsSettings = (state: RootState = {}) =>
  state.settings && state.settings.enableAnalytics

export const getServerUrlSetting = (state: RootState = {}) =>
  state.settings && state.settings.serverUrl

export const getVerboseLoggingSetting = (state: RootState = {}) =>
  state.settings && state.settings.verboseLogging
