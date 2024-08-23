/* tslint:disable:no-console */

import { LogBox } from 'react-native'

//export const DEFAULT_SERVER_URL = 'https://my.sapsailing.com'
export const DEFAULT_SERVER_URL = 'https://dev.sapsailing.com'
export const DATA_API_PREFIX = '/sailingserver/api/v1'
export const SHARED_DATA_API_PREFIX = '/sharedsailingserver/api/v1'
export const DATA_API_V2_PREFIX = '/sailingserver/api/v2'
export const AUTH_API_PREFIX = '/security/api/restsecurity'
export const RACE_API_PREFIX = '/sailingserver/rc'
export const BRANCH_APP_DOMAIN = 'sailinsight30-app.sapsailing.com'

export const init = () => {
  // initializations for local development
  LogBox.ignoreAllLogs(true)
  LogBox.ignoreLogs([
    'React.createFactory()',
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Cannot update a component from inside the function body of a different component'
  ])
}
