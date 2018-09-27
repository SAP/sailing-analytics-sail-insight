import { createSelector } from 'reselect'

import { User } from 'models'
import { AUTH_REDUCER_NAME, AuthReducerKeys } from 'reducers/config'


export const getAccessToken = (state: any = {}) =>
  state[AUTH_REDUCER_NAME] && state[AUTH_REDUCER_NAME][AuthReducerKeys.TOKEN]

export const getUserInfo = (state: any= {}) =>
  (state[AUTH_REDUCER_NAME] && state[AUTH_REDUCER_NAME][AuthReducerKeys.USER]) as User

export const isLoggedIn = createSelector(
  getAccessToken,
  token => !!token,
)
