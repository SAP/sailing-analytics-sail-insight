import { combineReducers } from 'redux'

import CheckInReducer from './CheckInReducer'
import EntityReducer from './EntityReducer'

const reducers = combineReducers({
  checkIn: CheckInReducer,
  entities: EntityReducer,
})


export default reducers
