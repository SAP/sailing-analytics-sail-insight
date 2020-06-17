import { handleActions } from 'redux-actions'

import {
    resetExpeditionCommunicationMessages,
    updateExpeditionCommunicationMessages,
    updateServerIP,
    updateServerPort,
    updateServerProtocol,
    updateServerState,
    updateServerValid,
    updateStartLine,
    startUpdateStartLineBasedOnCurrentCourse,
    stopUpdateStartLineBasedOnCurrentCourse,
    updateStartLinePollingStatus,
} from 'actions/communications'
import { clearArrayHandler, itemUpdateHandler } from 'helpers/reducers'
import { CommunicationsReducerState } from 'reducers/config'

import { compose } from 'recompose'
import { lt, when, dropLast, insert, length } from 'ramda'

const initialState: CommunicationsReducerState = {
  state: false,
  valid: false,
  protocol: '',
  ip: '0.0.0.0',
  port: '0000',
  startLine: {},
  startLinePolling: false,
  startLineCourse: {},
  expeditionMessages: [],
  expeditionMessagesLimit: 500,
}

const reducer = handleActions(
  {
    [updateServerState as any]: itemUpdateHandler('state'),
    [updateServerValid as any]: itemUpdateHandler('valid'),
    [updateServerProtocol as any]: itemUpdateHandler('protocol'),
    [updateServerIP as any]: itemUpdateHandler('ip'),
    [updateServerPort as any]: itemUpdateHandler('port'),
    [updateStartLine as any]: itemUpdateHandler('startLine'),
    [updateExpeditionCommunicationMessages as any]: (state: any = initialState, action) => {
      const exceedsLimit = compose(lt(state.expeditionMessagesLimit), length)
      const expeditionMessages = compose(
        when(exceedsLimit, dropLast(1)),
        insert(0, action.payload))(
        state.expeditionMessages)
      return {
        ...state,
        expeditionMessages
      }
    },
    [startUpdateStartLineBasedOnCurrentCourse as any]: (state: any = initialState, action) => {
      const payload = action.payload
      return {
        ...state,
        startLineCourse: payload
      }
    },
    [stopUpdateStartLineBasedOnCurrentCourse as any]: (state: any = initialState, action) => {
      return {
        ...state,
        startLineCourse: {}
      }
    },
    [updateStartLinePollingStatus as any]: itemUpdateHandler('startLinePolling'),
    [resetExpeditionCommunicationMessages as any]: clearArrayHandler('expeditionMessages'),
  },
  initialState,
)

export default reducer
