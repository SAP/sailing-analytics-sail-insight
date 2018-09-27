import { DispatchType } from 'helpers/types'
import { initialNavigation } from 'navigation'

import { checkCurrentAuthSession } from './auth'


export const initializeApp = () => async (dispatch: DispatchType) => {
  await dispatch(checkCurrentAuthSession())
  setTimeout(initialNavigation, 1000)
}
