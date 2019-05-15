import { handleActions } from 'redux-actions'

import { updateGpsBulkSetting, updateAnalyticsSettings } from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'
import { SettingsState } from 'reducers/config'
import { removeUserData } from '../actions/auth'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
  enableAnalytics: false
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [updateAnalyticsSettings as any]: itemUpdateHandler('enableAnalytics'),
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
