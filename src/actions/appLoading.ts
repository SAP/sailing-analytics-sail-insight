import { DispatchType } from 'helpers/types'
import { initialNavigation } from 'navigation'


export const initializeApp = () => (dispatch: DispatchType) => {
  // TODO: check if authenticated, etc.
  setTimeout(initialNavigation, 1000) // TODO: remove
}
