import { Dispatch } from 'helpers/types'
import { initialNavigation } from 'navigation'


export const initializeApp = () => (dispatch: Dispatch) => {
  // TODO: check if authenticated, etc.
  setTimeout(initialNavigation, 1000) // TODO: remove
}
