import { createSelector } from 'reselect'

import { User } from 'models'
import { RootState } from 'reducers/config'


export const getAccessToken = (state: RootState = {}) =>
  state.auth && state.auth.accessToken

export const getUserInfo = (state: RootState= {}) =>
  (state.auth && state.auth.user) as User

export const isLoggedIn = createSelector(
  getAccessToken,
  token => !!token,
)
