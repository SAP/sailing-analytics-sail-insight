import { Platform } from 'react-native'

import { init } from 'environment/init'


init()

export const DEV_MODE = __DEV__

export const isPlatformAndroid: boolean = Platform.OS === 'android'
export const isPlatformIOS: boolean = Platform.OS === 'ios'


export const platformSelect = (android: any, ios: any) => Platform.select({
  ios,
  android,
})

export {
  SERVER_URL,
  AUTH_API_PREFIX,
  DATA_API_PREFIX,
  SHARED_DATA_API_PREFIX,
  RACE_API_PREFIX,
  DATA_API_V2_PREFIX,
  BRANCH_APP_DOMAIN,
} from 'environment/init'
