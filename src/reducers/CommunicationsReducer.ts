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
import { clearArrayHandler, itemAddHandler, itemUpdateHandler } from 'helpers/reducers'
import { CommunicationsReducerState } from 'reducers/config'


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
}

const reducer = handleActions(
  {
    [updateServerState as any]: itemUpdateHandler('state'),
    [updateServerValid as any]: itemUpdateHandler('valid'),
    [updateServerProtocol as any]: itemUpdateHandler('protocol'),
    [updateServerIP as any]: itemUpdateHandler('ip'),
    [updateServerPort as any]: itemUpdateHandler('port'),
    [updateStartLine as any]: itemUpdateHandler('startLine'),
    [updateExpeditionCommunicationMessages as any]: itemAddHandler('expeditionMessages'),
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
