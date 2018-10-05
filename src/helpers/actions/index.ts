import { receiveEntities } from 'actions/entities'
import AuthException from 'api/AuthException'
import { DispatchType, GetStateType } from 'helpers/types'
import { getAccessToken } from 'selectors/auth'


export const fetchEntityAction = (requestFunction: ((...args: any[]) => void)) =>
  (...args: any[]) => async (dispatch: DispatchType) => {
    const payload = await requestFunction(...args)
    return payload && dispatch(receiveEntities(payload))
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

export { default as ActionQueue } from 'helpers/actions/ActionQueue'
