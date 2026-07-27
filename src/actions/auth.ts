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
  dispatch(removeUserData())
}

export const requestPasswordReset = (usernameOrEmail: string) => {
  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isEmail = re.test(usernameOrEmail.toLowerCase()) // Use the regex to test whether the string is an email
  if (isEmail) {
    return authApi().requestPasswordReset('', usernameOrEmail)
  }

  return authApi().requestPasswordReset(usernameOrEmail, '')
}

export const fetchCurrentUser = () => async (dispatch: DispatchType) =>
  dispatch(updateCurrentUserInformation(await authApi().user()))

export const authBasedNewSession = (navigation: any) => (dispatch: DispatchType, getState: GetStateType) => {
  const isNetworkConnected = isNetworkConnectedSelector(getState())
  if (!isNetworkConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }
  const isLoggedIn = isLoggedInSelector(getState())
  if (!isLoggedIn) {
    navigation.navigate(Screens.RegisterCredentials)
    return
  }
  // EventCreation (and the SessionDetail4Organizer screen it replaces itself
  // with after submit) is registered in the sessions stack only. The create
  // button also exists on the TrackingList mount of the Sessions screen, where
  // a bare navigate(EventCreation) is silently dropped — v7 doesn't resolve
  // names across sibling navigators. Spell out the full nested target so the
  // button works from both mounts.
  navigation.navigate(Screens.Main, {
    screen: Screens.SessionsNavigator,
    params: { screen: Screens.EventCreation },
  })
}

export const updateUser = (user: User) => async (dispatch: DispatchType) => {
  await authApi().updateUser(mapUserToRes(user))
  dispatch(fetchCurrentUser())
}
