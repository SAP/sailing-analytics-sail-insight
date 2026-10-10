import crashlytics from '@react-native-firebase/crashlytics'

import { call } from 'redux-saga/effects'
import Logger from 'helpers/Logger'
import { serializeDiagnostic } from 'helpers/diagnosticsRedaction'

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
      Logger.error('Saga API call failed', e)
      try {
        yield call([crashlytics(), crashlytics().setAttribute], 'saga', 'true')
        yield call([crashlytics(), crashlytics().recordError], new Error(serializeDiagnostic(e)))
      } catch (_) {
        // Crash reporting must not mask the original API failure.
      }
    }
  
    return result
  }