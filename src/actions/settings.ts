import { createAction } from 'redux-actions'
import { DispatchType } from 'helpers/types'
import analytics from '@react-native-firebase/analytics'

export const updateGpsBulkSetting    = createAction('SETTINGS_UPDATE_BULK_GPS')
export const updateServerUrlSetting = createAction('SETTINGS_UPDATE_SERVER_URL')
export const updateAnalyticsSettings = createAction('SETTINGS_UPDATE_ANALYTICS')
export const updateVerboseLoggingSetting = createAction('SETTINGS_UPDATE_VERBOSE_LOGGING')
export const updateLeaderboardEnabledSetting = createAction('SETTINGS_UPDATE_LEADERBOARD_ENABLED')

export const changeAnalyticsSetting = (value: boolean) => (dispatch: DispatchType) => {
    analytics().setAnalyticsCollectionEnabled(value)
    return dispatch(updateAnalyticsSettings(value))
}
