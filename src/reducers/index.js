import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'

export const CHECK_IN_REDUCER_NAME = 'checkIn'
export const ENTITIES_REDUCER_NAME = 'entities'

const reducers = combineReducers({
  [CHECK_IN_REDUCER_NAME]: CheckInReducer,
  [ENTITIES_REDUCER_NAME]: EntityReducer,
})


export default reducers
