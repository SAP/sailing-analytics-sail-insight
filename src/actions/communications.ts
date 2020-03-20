import { createAction } from 'redux-actions'

export const UPDATE_START_LINE = "COMMUNICATIONS_UPDATE_START_LINE"
export const UPDATE_SERVER_STATE = "COMMUNICATIONS_UPDATE_STATE"

export const updateServerState    = createAction(UPDATE_SERVER_STATE)
export const updateServerValid = createAction('COMMUNICATIONS_UPDATE_VALID')
export const updateServerProtocol = createAction('COMMUNICATIONS_UPDATE_PROTOCOL')
export const updateServerPort = createAction('COMMUNICATIONS_UPDATE_PORT')
export const updateServerIP = createAction('COMMUNICATIONS_UPDATE_IP')
export const updateStartLine = createAction(UPDATE_START_LINE)
