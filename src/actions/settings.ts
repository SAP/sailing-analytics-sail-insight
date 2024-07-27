import { createAction } from 'redux-actions'
import { DispatchType, GetStateType } from 'helpers/types'
import analytics from '@react-native-firebase/analytics'
import * as LocationService from 'services/LocationService'

export const updateGpsBulkSetting = createAction('SETTINGS_UPDATE_BULK_GPS')
export const updateServerUrlSetting = createAction('SETTINGS_UPDATE_SERVER_URL')
export const updateAnalyticsSettings = createAction('SETTINGS_UPDATE_ANALYTICS')
export const updateVerboseLoggingSetting = createAction('SETTINGS_UPDATE_VERBOSE_LOGGING')

export const changeAnalyticsSetting = (value: boolean) => (dispatch: DispatchType) => {
    analytics().setAnalyticsCollectionEnabled(value)
    return dispatch(updateAnalyticsSettings(value))
}

export const changeGpsBulkSetting = (value: boolean) => async (dispatch:DispatchType, getState:GetStateType ) => {
  dispatch(updateGpsBulkSetting(value))

  await LocationService.setConfig({
    autoSyncThreshold: value ?
      LocationService.GpsFixesThreshold.BATTERY_OPTIMIZED :
      LocationService.GpsFixesThreshold.NORMAL
  })
}
