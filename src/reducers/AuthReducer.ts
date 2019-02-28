import { handleActions } from 'redux-actions'

import { removeUserData, updateCurrentUserInformation, updateToken } from 'actions/auth'
import { itemUpdateHandler } from 'helpers/reducers'
import { rootInitialState } from './config'


const reducer = handleActions(
  {
    [updateToken as any]: itemUpdateHandler('accessToken'),
    [updateCurrentUserInformation as any]: itemUpdateHandler('user'),
    [removeUserData as any]: () => rootInitialState,
  },
  rootInitialState,
)

export default reducer
