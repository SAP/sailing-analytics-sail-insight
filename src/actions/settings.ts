import { createAction } from 'redux-actions'
import { DispatchType } from 'helpers/types';
import firebase from 'react-native-firebase';

export const updateGpsBulkSetting    = createAction('SETTINGS_UPDATE_BULK_GPS')
export const updateServerUrlSetting = createAction('SETTINGS_UPDATE_SERVER_URL')
export const updateAnalyticsSettings = createAction('SETTINGS_UPDATE_ANALYTICS')
export const updateVerboseLoggingSetting = createAction('SETTINGS_UPDATE_VERBOSE_LOGGING')

export const changeAnalyticsSetting = (value: boolean) => (dispatch: DispatchType) => {
    firebase.analytics().setAnalyticsCollectionEnabled(value)
    return dispatch(updateAnalyticsSettings(value))
}