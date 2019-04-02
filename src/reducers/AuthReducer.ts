import { handleActions } from 'redux-actions'

import { removeAuthInfo, removeUserData, updateCurrentUserInformation, updateToken } from 'actions/auth'
import { itemUpdateHandler } from 'helpers/reducers'

import { AuthState } from './config'


const initialState: AuthState = {
  accessToken: null,
  user: null,
}

const reducer = handleActions(
  {
    [updateToken as any]: itemUpdateHandler('accessToken'),
    [updateCurrentUserInformation as any]: itemUpdateHandler('user'),
    [removeAuthInfo as any]: () => initialState,
    [removeUserData as any]: () => initialState,
  },
  initialState,
)

export default reducer
