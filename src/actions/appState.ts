import { createAction } from 'redux-actions'

export const REGISTER_APP_STATE_LISTENERS = "REGISTER_APP_STATE_LISTENERS"
export const UNREGISTER_APP_STATE_LISTENERS = "UNREGISTER_APP_STATE_LISTENERS"
export const UPDATE_APP_STATE = "UPDATE_APP_STATE"
export const REGISTER_NET_STATE_LISTENERS = "REGISTER_NET_STATE_LISTENERS"
export const UNREGISTER_NET_STATE_LISTENERS = "UNREGISTER_NET_STATE_LISTENERS"
export const UPDATE_NET_STATE = "UPDATE_NET_STATE"

export const registerAppStateListeners      = createAction(REGISTER_APP_STATE_LISTENERS)
export const unregisterAppStateListeners    = createAction(UNREGISTER_APP_STATE_LISTENERS)
export const updateAppState                 = createAction(UPDATE_APP_STATE)
export const registerNetStateListeners      = createAction(REGISTER_NET_STATE_LISTENERS)
export const unregisterNetStateListeners    = createAction(UNREGISTER_NET_STATE_LISTENERS)
export const updateNetState                 = createAction(UPDATE_NET_STATE)

