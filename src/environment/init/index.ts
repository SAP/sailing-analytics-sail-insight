/* tslint:disable:no-console */

import { LogBox } from 'react-native'

export const DEFAULT_SERVER_URL = 'https://my.sapsailing.com'
export const DATA_API_PREFIX = '/sailingserver/api/v1'
export const SHARED_DATA_API_PREFIX = '/sharedsailingserver/api/v1'
export const DATA_API_V2_PREFIX = '/sailingserver/api/v2'
export const AUTH_API_PREFIX = '/security/api/restsecurity'
export const RACE_API_PREFIX = '/sailingserver/rc'
export const BRANCH_APP_DOMAIN = 'sailinsight30-app.sapsailing.com'

export const DEFAULT_DEVELOPMENT_SERVER_URL = 'https://sailtracks.sapsailing.com'
export const DEFAULT_SERVER_ANY_URL = 'any'
export const SERVER_PROXY_URL = 'https://proxy.syrfapp.com'
export const SERVER_MASTER_UDP_IP = '34.240.6.189'
export const SERVER_MASTER_UDP_PORT  = {
  [DEFAULT_SERVER_URL]: '2054', 
  [DEFAULT_DEVELOPMENT_SERVER_URL]: '2025',
  [DEFAULT_SERVER_ANY_URL]: '2054',
}

export const init = () => {
  // initializations for local development
  LogBox.ignoreAllLogs(true)
  LogBox.ignoreLogs([
    'React.createFactory()', 
    'VirtualizedLists should never be nested inside plain ScrollViews',
  ])
}
