import { handleActions } from 'redux-actions'

import { updateShowCopyResultsDisclaimer, updateShowEditResultsDisclaimer } from 'actions/uiState'
import { itemUpdateHandler } from 'helpers/reducers'

import { UIReducerState } from './config'


const initialState: UIReducerState = {
  showEditResultsDisclaimer: true,
  showCopyResultsDisclaimer: true,
}

const reducer = handleActions(
  {
    [updateShowEditResultsDisclaimer as any]: itemUpdateHandler('showEditResultsDisclaimer'),
    [updateShowCopyResultsDisclaimer as any]: itemUpdateHandler('showCopyResultsDisclaimer'),
  },
  initialState,
)

export default reducer
