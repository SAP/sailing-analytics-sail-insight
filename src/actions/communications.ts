import { createAction } from 'redux-actions'

export const UPDATE_START_LINE = 'COMMUNICATIONS_UPDATE_START_LINE'
export const UPDATE_SERVER_STATE = 'COMMUNICATIONS_UPDATE_STATE'
export const UPDATE_START_LINE_FOR_CURRENT_COURSE = 'COMMUNICATION_UPDATE_START_LINE_FOR_CURRENT_COURSE'
export const FETCH_COMMUNICATION_INFO = 'COMMUNICATION_FETCH_INFO'
export const FETCH_COMMUNICATION_STATE = 'COMMUNICATION_FETCH_STATE'
export const SET_COMMUNICATION_STATE = 'COMMUNICATION_SET_STATE'
export const START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL = 'START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL'
export const UPDATE_EXPEDITION_COMMUNICATION_MESSAGES = 'UPDATE_EXPEDITION_COMMUNICATION_MESSAGES'
export const RESET_EXPEDITION_COMMUNICATION_MESSAGES = 'RESET_EXPEDITION_COMMUNICATION_MESSAGES'

export const updateServerState    = createAction(UPDATE_SERVER_STATE)
export const updateServerValid = createAction('COMMUNICATIONS_UPDATE_VALID')
export const updateServerProtocol = createAction('COMMUNICATIONS_UPDATE_PROTOCOL')
export const updateServerPort = createAction('COMMUNICATIONS_UPDATE_PORT')
export const updateServerIP = createAction('COMMUNICATIONS_UPDATE_IP')
export const updateStartLine = createAction(UPDATE_START_LINE)
export const updateStartLineBasedOnCurrentCourse = createAction(UPDATE_START_LINE_FOR_CURRENT_COURSE)
export const fetchCommunicationInfo = createAction(FETCH_COMMUNICATION_INFO)
export const fetchCommunicationState = createAction(FETCH_COMMUNICATION_STATE)
export const setCommunicationState = createAction(SET_COMMUNICATION_STATE)
export const startExpeditionCommunicationMessagesChannel = createAction(START_EXPEDITION_COMMUNICATION_MESSAGES_CHANNEL)
export const updateExpeditionCommunicationMessages = createAction(UPDATE_EXPEDITION_COMMUNICATION_MESSAGES)
export const resetExpeditionCommunicationMessages = createAction(RESET_EXPEDITION_COMMUNICATION_MESSAGES)

