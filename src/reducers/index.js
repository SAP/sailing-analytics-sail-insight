import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'

const reducers = combineReducers({
  checkIn: CheckInReducer,
})


export default reducers
