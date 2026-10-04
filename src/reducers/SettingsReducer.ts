import { handleActions } from 'redux-actions'

import {
  updateGpsBulkSetting,
  updateAnalyticsSettings,
  updateServerUrlSetting,
  updateVerboseLoggingSetting,
  updateShowErrorDetailsSetting,
} from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'
import { SettingsState } from 'reducers/config'
import { removeUserData } from '../actions/auth'
import { DEFAULT_SERVER_URL } from '../environment/init'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
  enableAnalytics: false,
  serverUrl: DEFAULT_SERVER_URL,
  verboseLogging: false,
  showErrorDetails: false,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [updateAnalyticsSettings as any]: itemUpdateHandler('enableAnalytics'),
    [updateServerUrlSetting as any]: itemUpdateHandler('serverUrl'),
    [updateVerboseLoggingSetting as any]: itemUpdateHandler('verboseLogging'),
    [updateShowErrorDetailsSetting as any]: itemUpdateHandler('showErrorDetails'),
    [removeUserData as any]: (state:SettingsState) => ({
      ...initialState,
      serverUrl: state.serverUrl,
      showErrorDetails: state.showErrorDetails,
    }),
  },
  initialState,
)

export default reducer
