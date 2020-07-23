import { createAction } from 'redux-actions'
import { authApi } from 'api'
import AuthException from 'api/AuthException'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { DispatchType, GetStateType } from 'helpers/types'
import * as LocationService from 'services/LocationService'
import * as Screens from 'navigation/Screens'
import { ApiAccessToken, User } from 'models'
import { mapUserToRes } from 'models/User'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'

export type RegisterActionType = (username: string, email: string, password: string, name?: string) => any

export const updateToken = createAction('UPDATE_TOKEN')
export const updateCurrentUserInformation = createAction('UPDATE_CURRENT_USER_INFORMATION')
export const removeAuthInfo = createAction('REMOVE_AUTH_INFO')
export const removeUserData = createAction('REMOVE_USER_DATA')

const handleAccessToken = (dataPromise?: Promise<ApiAccessToken>) => async (dispatch: DispatchType) => {
  const data = await dataPromise
  await dispatch(updateToken(data && data.accessToken))
  await dispatch(fetchCurrentUser())
  await LocationService.setAccessToken(data?.accessToken || '')
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

export const logout = () => (dispatch: DispatchType) => {
  authApi().removeAccessToken()
  dispatch(removeUserData())
}

export const requestPasswordReset = (usernameOrEmail: string) => {
  if (usernameOrEmail.includes('@')) {
    return authApi().requestPasswordReset('', usernameOrEmail)
  }

  return authApi().requestPasswordReset(usernameOrEmail, '')
}

export const fetchCurrentUser = () => async (dispatch: DispatchType) =>
  dispatch(updateCurrentUserInformation(await authApi().user()))

export const authBasedNewSession = (navigation:object) => (dispatch: DispatchType, getState: GetStateType) => {
  const isNetworkConnected = isNetworkConnectedSelector(getState())
  if (!isNetworkConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }
  const isLoggedIn = isLoggedInSelector(getState())
  navigation.navigate(isLoggedIn ? Screens.EventCreation : Screens.RegisterCredentials)
}

export const updateUser = (user: User) => async (dispatch: DispatchType) => {
  await authApi().updateUser(mapUserToRes(user))
  dispatch(fetchCurrentUser())
}
