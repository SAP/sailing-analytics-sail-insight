import { isString } from 'lodash'

import { dataApi, DataApi } from 'api'

import { receiveEntities } from 'actions/entities'
import AuthException from 'api/AuthException'
import { DispatchType, GetStateType } from 'helpers/types'
import { getAccessToken } from 'selectors/auth'
import { getServerUrl, getTrackedCheckIn } from 'selectors/checkIn'
import CheckInException from 'services/CheckInService/CheckInException'

export const fetchAction = (
  requestFunction: (...args: any[]) => void,
  actionCreator: (...args: any[]) => any,
) => (...args: any[]) => async (dispatch: DispatchType) => {
  const payload: any = await requestFunction(...args)
  return payload && dispatch(actionCreator(payload))
}

export const fetchEntityAction = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: DispatchType) => {
    return await dispatch(fetchAction(requestFunction, receiveEntities)(...args))
  }

type TokenAction = (token: string, dispatch: DispatchType, getState: GetStateType) => any
type TokenActionHandler = (action: TokenAction) => ((dispatch: DispatchType, getState: GetStateType) => any)
export const withToken: TokenActionHandler = (tokenAction: TokenAction) => (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const token = getAccessToken(getState())
  if (!token) {
    throw AuthException.create('TOKEN INVALID')
  }
  return tokenAction(token, dispatch, getState)
}

type DataApiAction = (dataApi: DataApi, dispatch: DispatchType, getState: GetStateType) => any
type DataApiActionHandler = (action: DataApiAction) => ((dispatch: DispatchType, getState: GetStateType) => any)
type DataApiInjector = (options?: string | {leaderboard?: string, secret?: string, fromTracked?: boolean}) => DataApiActionHandler
/**
 * get action handler with data api as parameter
 * @param options serverUrl OR options with leaderboard name
 */
export const withDataApi: DataApiInjector = (options = {}) => serverUrlAction => (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  let serverUrl
  if (isString(options)) {
    serverUrl = options
  } else if (options.leaderboard) {
    serverUrl = getServerUrl(options.leaderboard)(getState())
  } else if (options.fromTracked) {
    const checkIn = getTrackedCheckIn(getState())
    serverUrl = checkIn && checkIn.serverUrl
  }
  if (!serverUrl) {
    throw new CheckInException('Setup DataApi: server url invalid.')
  }
  return serverUrlAction(dataApi(serverUrl), dispatch, getState)
}

export { default as ActionQueue } from 'helpers/actions/ActionQueue'
