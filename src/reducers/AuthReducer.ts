import { handleActions } from 'redux-actions'

import { removeAuthInfo, updateCurrentUserInformation, updateToken } from 'actions/auth'
import { itemUpdateHandler } from 'helpers/reducers'

import { AuthReducerKeys } from './config'


const initialState = {
  [AuthReducerKeys.TOKEN]: null,
  [AuthReducerKeys.USER]: null,
}

const reducer = handleActions(
  {
    [updateToken as any]: itemUpdateHandler(AuthReducerKeys.TOKEN),
    [updateCurrentUserInformation as any]: itemUpdateHandler(AuthReducerKeys.USER),
    [removeAuthInfo as any]: () => initialState,
  },
  initialState,
)

export default reducer
