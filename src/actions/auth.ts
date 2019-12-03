import { createAction } from 'redux-actions'

import { authApi } from 'api'
import AuthException from 'api/AuthException'
import { DispatchType, GetStateType } from 'helpers/types'
import { navigateToEventCreation, navigateToUserProfile, navigateToUserRegistration } from 'navigation'

import { ApiAccessToken, User } from 'models'
import { mapUserToRes } from 'models/User'

import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'


export type RegisterActionType = (username: string, email: string, password: string, name: string) => any

export const updateToken = createAction('UPDATE_TOKEN')
export const updateCurrentUserInformation = createAction('UPDATE_CURRENT_USER_INFORMATION')
export const removeAuthInfo = createAction('REMOVE_AUTH_INFO')
export const removeUserData = createAction('REMOVE_USER_DATA')

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

export const register: RegisterActionType = (username, email, password, name) =>
  handleAccessToken(authApi().register(username, email, password, name))

export const login = (email: string, password: string) =>
  handleAccessToken(authApi().accessToken(email, password))

export const requestPasswordReset = (username: string, email: string) =>
   authApi().requestPasswordReset(username, email)

export const fetchCurrentUser = () => async (dispatch: DispatchType) =>
  dispatch(updateCurrentUserInformation(await authApi().user()))

export const authBasedNewSession = () => (dispatch: DispatchType, getState: GetStateType) => {
  const isLoggedIn = isLoggedInSelector(getState())
  return isLoggedIn ? navigateToEventCreation() : navigateToUserRegistration()
}

export const authBasedUserProfile = () => (dispatch: DispatchType, getState: GetStateType) => {
  const isLoggedIn = isLoggedInSelector(getState())
  return isLoggedIn ? navigateToUserProfile() : navigateToUserRegistration()
}

export const updateUser = (user: User) => async (dispatch: DispatchType) => {
  // sync with server
  await authApi().updateUser(mapUserToRes(user))
  dispatch(fetchCurrentUser())
}
