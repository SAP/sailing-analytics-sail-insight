import { handleActions } from 'redux-actions'

import { updateGpsBulkSetting, updateServerUrlSetting } from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'
import { SettingsState } from 'reducers/config'
import { removeUserData } from '../actions/auth'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
  serverUrl: 'https://my.sapsailing.com',
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [updateServerUrlSetting as any]: itemUpdateHandler('serverUrl'),
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
