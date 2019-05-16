import { RootState } from 'reducers/config'


export const getBulkGpsSetting = (state: RootState = {}) =>
  state.settings && state.settings.bulkGpsUpdate

export const getEnableAnalyticsSettings = (state: RootState = {}) =>
  state.settings && state.settings.enableAnalytics