import { handleActions } from 'redux-actions'

import { updateGpsBulkSetting } from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'

import { SettingsState } from './config'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
  },
  initialState,
)

export default reducer
