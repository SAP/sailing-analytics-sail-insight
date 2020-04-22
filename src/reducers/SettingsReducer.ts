import { handleActions } from 'redux-actions'

import {
  updateGpsBulkSetting,
  updateAnalyticsSettings,
  updateLeaderboardEnabledSetting,
  updateServerUrlSetting,
  updateVerboseLoggingSetting,
  updateMtcpAndCommunicationSetting,
  updateServerProxyUrlSetting,
  updateMasterUdpIPSetting,
  updateMasterUdpPortSetting,
} from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'
import { SettingsState } from 'reducers/config'
import { removeUserData } from '../actions/auth'
import { DEFAULT_SERVER_URL, SERVER_PROXY_URL, SERVER_MASTER_UDP_IP, SERVER_MASTER_UDP_PORT, DEFAULT_SERVER_ANY_URL } from '../environment/init'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
  enableAnalytics: false,
  serverUrl: DEFAULT_SERVER_URL,
  verboseLogging: false,
  mtcpAndCommunication: false,
  leaderboardEnabled: false,
  proxyUrl: SERVER_PROXY_URL,
  masterUdpIP: SERVER_MASTER_UDP_IP,
  masterUdpPort: SERVER_MASTER_UDP_PORT,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [updateAnalyticsSettings as any]: itemUpdateHandler('enableAnalytics'),
    [updateServerUrlSetting as any]: itemUpdateHandler('serverUrl'),
    [updateVerboseLoggingSetting as any]: itemUpdateHandler('verboseLogging'),
    [updateMtcpAndCommunicationSetting as any]: itemUpdateHandler('mtcpAndCommunication'),
    [updateLeaderboardEnabledSetting as any]: itemUpdateHandler('leaderboardEnabled'),
    [updateServerProxyUrlSetting as any]: itemUpdateHandler('proxyUrl'),
    [updateMasterUdpIPSetting as any]: itemUpdateHandler('masterUdpIP'),
    [updateMasterUdpPortSetting as any]: (state: any = {}, action?: any) => {
      if (state.serverUrl && state.masterUdpPort[state.serverUrl]) {
        return {
          ...state,
          masterUdpPort: {
            ...state.masterUdpPort,
            [state.serverUrl]: action && action.payload
          }
        }
      } else {
        return {
          ...state,
          masterUdpPort: {
            ...state.masterUdpPort,
            [DEFAULT_SERVER_ANY_URL]: action && action.payload
          }
        }
      }
    },
    [removeUserData as any]: (state:SettingsState) => ({ ...initialState, serverUrl: state.serverUrl }),
  },
  initialState,
)

export default reducer
