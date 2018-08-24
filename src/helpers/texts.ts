import { get } from 'lodash'

import ApiException from 'api/ApiException'
import I18n from 'i18n'
import { MISSING_PREFIX } from 'i18n/utils'

const ERROR_TRANSLATION_PREFIX = 'error_'

const getTranslation = (translationKey: string, defaultMessage?: string, params?: any) => {
  const result = I18n.t(translationKey, params)
  return result.startsWith(MISSING_PREFIX) && defaultMessage ?
    defaultMessage :
    result
}

export const UNKNOWN_ERROR_KEY = 'unknown'
export const UNKNOWN_ERROR_KEY_WITH_CODE = 'error_with_code'

export const getErrorMessage = (key: string, defaultMessage?: string, translationPrefix?: string) => {
  if (!translationPrefix) {
    return getTranslation(`${ERROR_TRANSLATION_PREFIX}${key}`, defaultMessage)
  }
  const result = getTranslation(`${translationPrefix}${key}`)
  return result.startsWith(MISSING_PREFIX) ?
    getTranslation(`${ERROR_TRANSLATION_PREFIX}${key}`, defaultMessage) :
    result
}

export const getUnknownErrorMessage = (errorCode?: string) => (errorCode ?
  getTranslation(UNKNOWN_ERROR_KEY_WITH_CODE, undefined, { code: errorCode }) :
  getErrorMessage(UNKNOWN_ERROR_KEY)
)

export const getErrorDisplayMessage = (exception: any) => {
  if (get(exception, 'name') === ApiException.NAME) {
    const errorKey = get(exception, 'message')
    return getErrorMessage(errorKey, getUnknownErrorMessage(get(exception, 'status')))
  }
  return getUnknownErrorMessage()
}
