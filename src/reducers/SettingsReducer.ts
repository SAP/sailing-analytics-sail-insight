import { handleActions } from 'redux-actions'

import {
  updateGpsBulkSetting,
  updateAnalyticsSettings,
  updateLeaderboardEnabledSetting,
  updateServerUrlSetting,
  updateVerboseLoggingSetting,
  updateMtcpAndCommunicationSetting
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
  mtcpAndCommunication: false,
  leaderboardEnabled: false,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [updateAnalyticsSettings as any]: itemUpdateHandler('enableAnalytics'),
    [updateServerUrlSetting as any]: itemUpdateHandler('serverUrl'),
    [updateVerboseLoggingSetting as any]: itemUpdateHandler('verboseLogging'),
    [updateMtcpAndCommunicationSetting as any]: itemUpdateHandler('mtcpAndCommunication'),
    [updateLeaderboardEnabledSetting as any]: itemUpdateHandler('leaderboardEnabled'),
    [removeUserData as any]: (state:SettingsState) => ({ ...initialState, serverUrl: state.serverUrl }),
  },
  initialState,
)

export default reducer
