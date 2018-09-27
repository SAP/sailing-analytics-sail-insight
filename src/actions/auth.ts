import { createAction } from 'redux-actions'

import { authApi } from 'api'
import AuthException from 'api/AuthException'
import { DispatchType, GetStateType } from 'helpers/types'
import { ApiAccessToken, User } from 'models'
import { mapUserToRes } from 'models/User'
import { navigateToNewSession, navigateToUserRegistration } from 'navigation'
import { getAccessToken, isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { generateNewSession } from 'services/SessionService'


export type RegisterActionType = (email: string, password: string, name: string) => any

export const updateToken = createAction('UPDATE_TOKEN')
export const updateCurrentUserInformation = createAction('UPDATE_CURRENT_USER_INFORMATION')
export const removeAuthInfo = createAction('REMOVE_AUTH_INFO')

const handleAccessToken = (dataPromise?: Promise<ApiAccessToken>) => async (dispatch: DispatchType) => {
  const data = await dataPromise
  await dispatch(updateToken(data && data.accessToken))
  await dispatch(fetchCurrentUser())
}

export const authToken = () => (dispatch: DispatchType, getState: GetStateType) => getAccessToken(getState())

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

export const fetchCurrentUser = () => async (dispatch: DispatchType) => {
  const token = dispatch(authToken())
  if (!token) {
    throw new AuthException()
  }
  dispatch(updateCurrentUserInformation(await authApi.user(token)))
}

export const authBasedNewSession = () => (dispatch: DispatchType, getState: GetStateType) => {
  const isLoggedIn = isLoggedInSelector(getState())
  return isLoggedIn ? navigateToNewSession(generateNewSession()) : navigateToUserRegistration()
}

export const updateUser = (user: User) => async (dispatch: DispatchType) => {
  const token = dispatch(authToken())
  if (!token) {
    throw new AuthException()
  }
  await authApi.updateUser(token, mapUserToRes(user))
  dispatch(fetchCurrentUser())
}
