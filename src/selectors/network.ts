import { NETWORK_REDUCER_NAME } from 'reducers/config'


export const isNetworkConnected = (state: any = {}) =>
  state[NETWORK_REDUCER_NAME] && state[NETWORK_REDUCER_NAME].isConnected
