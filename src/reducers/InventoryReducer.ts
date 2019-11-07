import { handleActions } from 'redux-actions'
import { receiveMarks } from 'actions/inventory'

const initialState = {
  marks: [],
}

const reducer = handleActions(
  {
    [receiveMarks as any]: (state: any = {}, action: any) => {
      return action.payload
    },
  },
  initialState
)

export default reducer
