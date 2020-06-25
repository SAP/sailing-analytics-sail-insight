import { RootState } from 'reducers/config'

export const getAppState = () => (state: RootState = {}) =>
  state.appState && state.appState.active