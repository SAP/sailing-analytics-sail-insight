/* tslint:disable:no-console */

import { LogBox } from 'react-native'

export const SERVER_URL = process.env.SERVER_URL
export const DATA_API_PREFIX = process.env.DATA_API_PREFIX
export const DATA_API_V2_PREFIX = process.env.DATA_API_V2_PREFIX
export const AUTH_API_PREFIX = process.env.AUTH_API_PREFIX
export const RACE_API_PREFIX = process.env.RACE_API_PREFIX
export const BRANCH_APP_DOMAIN = process.env.BRANCH_IO_APP_DOMAIN

export const init = () => {
  // initializations for dev build
  LogBox.ignoreAllLogs(true)
}

