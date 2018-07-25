import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import Reducers from 'reducers'


export default (initialState = {}) => {
  const enhancers = composeWithDevTools(applyMiddleware(
    ReduxThunk,
  ))

  return createStore(Reducers, initialState, enhancers)
}
