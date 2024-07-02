import { createAction } from 'redux-actions'
import { DispatchType, GetStateType } from 'helpers/types'
import analytics from '@react-native-firebase/analytics'
import * as LocationService from 'services/LocationService'

export const UPDATE_COMMUNICATION_SETTINGS = "UPDATE_COMMUNICATION_SETTINGS"
export const UPDATE_MTCP_SETTINGS = "UPDATE_MTCP_SETTINGS"
export const UPDATE_COMMUNICATION_ENABLED_SETTING = "SETTINGS_COMMUNICATION_ENABLED"
export const UPDATE_MTCP_ENABLED_SETTING = "SETTING_MTCP_ENABLED"

export const updateGpsBulkSetting = createAction('SETTINGS_UPDATE_BULK_GPS')
export const updateServerUrlSetting = createAction('SETTINGS_UPDATE_SERVER_URL')
export const updateAnalyticsSettings = createAction('SETTINGS_UPDATE_ANALYTICS')
export const updateVerboseLoggingSetting = createAction('SETTINGS_UPDATE_VERBOSE_LOGGING')
export const updateCommunicationEnabledSetting = createAction(UPDATE_COMMUNICATION_ENABLED_SETTING)
export const updateMtcpEnabledSetting = createAction(UPDATE_MTCP_ENABLED_SETTING)
export const updateLeaderboardEnabledSetting = createAction('SETTINGS_UPDATE_LEADERBOARD_ENABLED')

export const updateServerProxyUrlSetting = createAction('SETTINGS_UPDATE_SERVER_PROXY_URL')
export const updateMasterUdpIPSetting = createAction('SETTINGS_UPDATE_MASTER_UDP_IP')
export const updateMasterUdpPortSetting = createAction('SETTINGS_UPDATE_MASTER_UDP_PORT')
export const updateCommunicationSettings = createAction(UPDATE_COMMUNICATION_SETTINGS)
export const updateMtcpSettings = createAction(UPDATE_MTCP_SETTINGS)

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
