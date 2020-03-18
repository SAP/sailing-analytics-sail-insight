import { RootState } from 'reducers/config'

export const getServerState = (state: RootState = {}) =>
  state.communications && state.communications.state

export const getServerIP = (state: RootState = {}) =>
  state.communications && state.communications.ip

export const getServerPort = (state: RootState = {}) =>
  state.communications && state.communications.port

export const getServerProtocol = (state: RootState = {}) =>
  state.communications && state.communications.protocol

export const getServerValid = (state: RootState = {}) => 
  state.communications && state.communications.valid