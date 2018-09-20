import { handleActions } from 'redux-actions'

import { updateGpsBulkSetting } from 'actions/settings'
import { itemUpdateHandler } from 'helpers/reducers'

import { SettingsReducerKeys } from './config'


const initialState = {
  [SettingsReducerKeys.BULK_GPS_UPDATE]: false,
}

const reducer = handleActions(
  {
    [updateGpsBulkSetting as any]: itemUpdateHandler(SettingsReducerKeys.BULK_GPS_UPDATE),
  },
  initialState,
)

export default reducer
