import { handleActions } from 'redux-actions'

import { updateAppState, updateNetState } from 'actions/appState'
import { itemUpdateHandler } from 'helpers/reducers'

import { AppReducerState } from './config'


const initialState: AppReducerState = {
  active: true,
  networkAvailable: true
}

const reducer = handleActions(
  {
    [updateAppState as any]: itemUpdateHandler('active'),
    [updateNetState as any]: itemUpdateHandler('networkAvailable')
  },
  initialState,
)

export default reducer