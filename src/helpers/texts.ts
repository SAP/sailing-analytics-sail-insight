import { isString } from 'lodash'

import ApiException from 'api/ApiException'
import { STATUS_FORBIDDEN, STATUS_PRECONDITION_FAILED, STATUS_UNAUTHORIZED } from 'api/constants'
import I18n from 'i18n'
import { MISSING_PREFIX } from 'i18n/utils'

import { ErrorCodes } from './errors'


const ERROR_TRANSLATION_PREFIX = 'error_'
const USER_EXISTS_TEXT = 'user already exists'

const getTranslation = (translationKey: string, defaultMessage?: string, params?: any) => {
  const result = I18n.t(translationKey, params)
  return result.startsWith(MISSING_PREFIX) && defaultMessage ?
    defaultMessage :
    result
}

export const ERROR_TITLE_KEY = 'title'
export const UNKNOWN_ERROR_KEY = 'unknown'
export const UNKNOWN_ERROR_KEY_WITH_CODE = 'error_with_code'

export const getErrorMessage = (translationKey: string, defaultMessage?: string, translationPrefix?: string) => {
  const key = translationKey.toLowerCase()
  if (!translationPrefix) {
    return getTranslation(`${ERROR_TRANSLATION_PREFIX}${key}`, defaultMessage)
  }
  const result = getTranslation(`${translationPrefix}${key}`)
  return result.startsWith(MISSING_PREFIX) ?
    getTranslation(`${ERROR_TRANSLATION_PREFIX}${key}`, defaultMessage) :
    result
}

export const getErrorTitle = () => I18n.t(`${ERROR_TRANSLATION_PREFIX}${ERROR_TITLE_KEY}`)

export const getUnknownErrorMessage = (errorCode?: string | number) => (errorCode ?
  getTranslation(UNKNOWN_ERROR_KEY_WITH_CODE, undefined, { code: errorCode }) :
  getErrorMessage(UNKNOWN_ERROR_KEY)
)

export const getErrorDisplayMessage = (exception: any) => {
  if (!exception || (!exception.name && !exception.baseTypeName)) {
    return getUnknownErrorMessage()
  }
  if (exception.name === ApiException.NAME || exception.baseTypeName === ApiException.NAME) {
    const error = exception as ApiException
    const errorKey = error.message
    switch (error.status) {
      case STATUS_UNAUTHORIZED:
        return I18n.t(ErrorCodes.UNAUTHORIZED)
      case STATUS_FORBIDDEN:
        return I18n.t(ErrorCodes.FORBIDDEN)
      case STATUS_PRECONDITION_FAILED:
        return isString(errorKey) && errorKey.toLowerCase().includes(USER_EXISTS_TEXT) ?
          I18n.t(ErrorCodes.USER_EXISTS) :
          I18n.t(ErrorCodes.PRECONDITION_FAILED)
      default:
        return getErrorMessage(errorKey, getUnknownErrorMessage(error.status))
    }
  }
  return getUnknownErrorMessage()
}

export const getCaptionTranslationKey = (suffix: string) => `caption_${suffix}`

export const getTabItemTitleTranslation = (routeName: string) =>
  I18n.t(getCaptionTranslationKey(`tab_${routeName.toLowerCase()}`))
