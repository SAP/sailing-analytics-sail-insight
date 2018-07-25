import { combineReducers } from 'redux'

import NavigationReducer from './NavigationReducer'


const reducers = combineReducers({
  nav: NavigationReducer,
})


export default reducers
