import crashlytics from '@react-native-firebase/crashlytics'

import { call } from 'redux-saga/effects'

export function* safe(effect: any) {
    try {
      return { result: yield effect, error: null }
    } catch (error) {
      return { result: null, error }
    }
  }
  
  export function* safeApiCall(method: any, ...args: any[]) {
    let result
  
    try {
      result = yield call(method, ...args)
    } catch (e) {
      crashlytics().setAttribute('saga', 'true')
      crashlytics().recordError(e)
    }
  
    return result
  }