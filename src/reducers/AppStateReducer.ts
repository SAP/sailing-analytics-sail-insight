import { handleActions } from 'redux-actions'

import { updateAppState } from 'actions/appState'
import { itemUpdateHandler } from 'helpers/reducers'

import { AppReducerState } from './config'


const initialState: AppReducerState = {
  active: true,
}

const reducer = handleActions(
  {
    [updateAppState as any]: itemUpdateHandler('active'),
  },
  initialState,
)

export default reducer