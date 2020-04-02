import { createAction } from 'redux-actions'
import { DispatchType } from 'helpers/types'
import analytics from '@react-native-firebase/analytics'

export const updateGpsBulkSetting    = createAction('SETTINGS_UPDATE_BULK_GPS')
export const updateServerUrlSetting = createAction('SETTINGS_UPDATE_SERVER_URL')
export const updateAnalyticsSettings = createAction('SETTINGS_UPDATE_ANALYTICS')
export const updateVerboseLoggingSetting = createAction('SETTINGS_UPDATE_VERBOSE_LOGGING')
export const updateMtcpAndCommunicationSetting = createAction('SETTINGS_MTCP_COMMUNICATION')
export const updateLeaderboardEnabledSetting = createAction('SETTINGS_UPDATE_LEADERBOARD_ENABLED')

export const updateServerProxyUrlSetting = createAction('SETTINGS_UPDATE_SERVER_PROXY_URL')
export const updateMasterUdpIPSetting = createAction('SETTINGS_UPDATE_MASTER_UDP_IP')
export const updateMasterUdpPortSetting = createAction('SETTINGS_UPDATE_MASTER_UDP_PORT')

export const changeAnalyticsSetting = (value: boolean) => (dispatch: DispatchType) => {
    analytics().setAnalyticsCollectionEnabled(value)
    return dispatch(updateAnalyticsSettings(value))
}
