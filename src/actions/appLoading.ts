import { DispatchType } from 'helpers/types'
import { initialNavigation } from 'navigation'

import { checkCurrentAuthSession } from './auth'
import { handleAppStartDeepLink } from './deepLinking'


export const initializeApp = () => async (dispatch: DispatchType) => {
  await dispatch(checkCurrentAuthSession())
  initialNavigation()
  await dispatch(handleAppStartDeepLink())
}
