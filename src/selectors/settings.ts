import { SETTINGS_REDUCER_NAME, SettingsReducerKeys } from 'reducers/config'


export const getBulkGpsSetting = (state: any = {}) =>
  state[SETTINGS_REDUCER_NAME] && state[SETTINGS_REDUCER_NAME][SettingsReducerKeys.BULK_GPS_UPDATE]
