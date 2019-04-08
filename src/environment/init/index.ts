/* tslint:disable:no-console */

// export const SERVER_URL = 'https://d-labs.sapsailing.com'
export const SERVER_URL = 'https://my.sapsailing.com'
export const DATA_API_PREFIX = '/sailingserver/api/v1'
export const DATA_API_V2_PREFIX = '/sailingserver/api/v2'
export const AUTH_API_PREFIX = '/security/api/restsecurity'
export const RACE_API_PREFIX = '/sailingserver/rc'
export const BRANCH_APP_DOMAIN = 'sailinsight20-app.sapsailing.com'

export const init = () => {
  // initializations for local development
  console.disableYellowBox = true
}
