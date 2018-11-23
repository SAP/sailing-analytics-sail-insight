import { createAction } from 'redux-actions'

import { authApi } from 'api'
import AuthException from 'api/AuthException'
import { DispatchType, GetStateType } from 'helpers/types'
import { ApiAccessToken, User } from 'models'
import { mapUserToRes } from 'models/User'
import { navigateToNewSession, navigateToUserRegistration } from 'navigation'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'


export type RegisterActionType = (email: string, password: string, name: string) => any

export const updateToken = createAction('UPDATE_TOKEN')
export const updateCurrentUserInformation = createAction('UPDATE_CURRENT_USER_INFORMATION')
export const removeAuthInfo = createAction('REMOVE_AUTH_INFO')

const handleAccessToken = (dataPromise?: Promise<ApiAccessToken>) => async (dispatch: DispatchType) => {
  const data = await dataPromise
  await dispatch(updateToken(data && data.accessToken))
  await dispatch(fetchCurrentUser())
}

export const checkCurrentAuthSession = () => async (dispatch: DispatchType) => {
  try {
    await dispatch(fetchCurrentUser())
  } catch (err) {
    if (err.name === AuthException.NAME) {
      dispatch(removeAuthInfo())
    }
  }
}

export const register: RegisterActionType = (email: string, password: string, name: string) =>
  handleAccessToken(authApi.register(email, password, name))

export const login = (email: string, password: string) =>
  handleAccessToken(authApi.accessToken(email, password))

export const fetchCurrentUser = () => async (dispatch: DispatchType) =>
  dispatch(updateCurrentUserInformation(await authApi.user()))

export const authBasedNewSession = () => (dispatch: DispatchType, getState: GetStateType) => {
  const isLoggedIn = isLoggedInSelector(getState())
  return isLoggedIn ? navigateToNewSession() : navigateToUserRegistration()
}

export const updateUser = (user: User) => async (dispatch: DispatchType) => {
  await authApi.updateUser(mapUserToRes(user))
  dispatch(fetchCurrentUser())
}
