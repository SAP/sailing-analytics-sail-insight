import { RootState } from 'reducers/config'


export const isNetworkConnected = (state: RootState = {}) =>
  state.network && state.network.isConnected
