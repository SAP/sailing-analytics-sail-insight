import { RootState } from 'reducers/config'

export const isAppActive = () => (state: RootState = {}) =>
  state.appState && state.appState.active