import { handleActions } from 'redux-actions'

import { updateGpsBulkSetting } from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'
import { SettingsState } from 'reducers/config'
import { removeUserData } from '../actions/auth'


const initialState: SettingsState = {
  bulkGpsUpdate: false,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler('bulkGpsUpdate'),
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
