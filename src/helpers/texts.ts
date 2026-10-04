import { isString } from 'lodash'

import AuthException from 'api/AuthException'

import ApiException from 'api/ApiException'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import {
  STATUS_BAD_GATEWAY,
  STATUS_FORBIDDEN,
  STATUS_GATEWAY_TIMEOUT,
  STATUS_INTERNAL_ERROR,
  STATUS_NOT_FOUND,
  STATUS_PRECONDITION_FAILED,
  STATUS_SERVICE_UNAVAILABLE,
  STATUS_UNAUTHORIZED,
} from 'api/constants'
import EventCreatedSetupIncompleteException from 'helpers/EventCreatedSetupIncompleteException'
import CheckInException from 'services/CheckInService/CheckInException'
import I18n from 'i18n'
import { MISSING_PREFIX } from 'i18n/utils'

import { ErrorCodes } from './errors'


const ERROR_TRANSLATION_PREFIX = 'error_'
const USER_EXISTS_TEXT = 'user already exists'
const DEVICE_ALREADY_REGISTERED = 'device is already registered'
const PERMISSION_DENIED_TEXTS = ['unauthorizedexception', 'does not have permission']
const SIGNUP_RATE_LIMIT_TEXT = 'locked for user creation'
const MAX_ERROR_BODY_LENGTH = 2000
const SENSITIVE_QUERY_PARAM = /([?&][^=&#]*(?:secret|token|password|email|mail|username|user)[^=&#]*=)[^&#]*/gi

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
  // ToDo: could we do a better solution? quickfix for unhandled rejection
  let dataErrorCodeName = null
  try {
    const data = JSON.parse(exception.data)
    dataErrorCodeName = data.errorCodeName
  } catch (e) {
    // ignore
  }

  if (!exception || (!exception.name && !exception.baseTypeName && dataErrorCodeName == null)) {
    return getUnknownErrorMessage()
  }

  // Only translate errorCodeNames we actually have a mapping for —
  // I18n.t(undefined) would surface a raw "[missing ...]" string.
  const mappedErrorCode = dataErrorCodeName != null ? (ErrorCodes as any)[dataErrorCodeName] : null
  if (mappedErrorCode) {
    return I18n.t(mappedErrorCode)
  }

  if (exception.name === EventCreatedSetupIncompleteException.NAME) {
    return I18n.t('error_event_created_setup_incomplete')
  }

  if (exception.name === NetworkTimeoutException.NAME) {
    return I18n.t(ErrorCodes.NETWORK_TIMEOUT)
  }

  // React Native's fetch rejects network-level failures (offline, DNS,
  // unreachable host) with TypeError('Network request failed').
  if (exception.name === 'TypeError' &&
      isString(exception.message) &&
      exception.message.toLowerCase().includes('network request failed')) {
    return I18n.t(ErrorCodes.NETWORK_TIMEOUT)
  }

  if (exception.name === ApiException.NAME || exception.baseTypeName === ApiException.NAME) {
    const error = exception as ApiException
    const errorKey = error.message
    const lowerCaseKey = isString(errorKey) ? errorKey.toLowerCase() : ''
    if (PERMISSION_DENIED_TEXTS.some(text => lowerCaseKey.includes(text))) {
      return I18n.t(ErrorCodes.PERMISSION_DENIED)
    }
    switch (error.status) {
      case STATUS_UNAUTHORIZED:
        return I18n.t(ErrorCodes.UNAUTHORIZED)
      case STATUS_FORBIDDEN:
        return isString(errorKey) && errorKey.toLowerCase().includes(DEVICE_ALREADY_REGISTERED) ?
          I18n.t(ErrorCodes.DEVICE_ALREADY_EXISTS) :
          I18n.t(ErrorCodes.FORBIDDEN)
      case STATUS_PRECONDITION_FAILED:
        if (lowerCaseKey.includes(SIGNUP_RATE_LIMIT_TEXT)) {
          return I18n.t(ErrorCodes.SIGNUP_RATE_LIMITED)
        }
        return lowerCaseKey.includes(USER_EXISTS_TEXT) ?
          I18n.t(ErrorCodes.USER_EXISTS) :
          I18n.t(ErrorCodes.PRECONDITION_FAILED)
      case STATUS_NOT_FOUND:
        return I18n.t(ErrorCodes.NOT_FOUND)
      case STATUS_INTERNAL_ERROR:
      case STATUS_BAD_GATEWAY:
      case STATUS_SERVICE_UNAVAILABLE:
      case STATUS_GATEWAY_TIMEOUT:
        return I18n.t(ErrorCodes.SERVER_BUSY)
      default:
        return getErrorMessage(errorKey, getUnknownErrorMessage(error.status))
    }
  }
  return getUnknownErrorMessage()
}

// A timeout or server outage must not be reported as "wrong password".
export const getLoginErrorMessage = (exception: any) => {
  const isUnauthorized = exception && (
    exception.name === AuthException.NAME ||
    exception.status === STATUS_UNAUTHORIZED)
  return isUnauthorized ? I18n.t(ErrorCodes.LOGIN_INCORRECT) : getErrorDisplayMessage(exception)
}

const SENSITIVE_BODY_VALUE = /("[^"]*(?:secret|token|password)[^"]*"\s*:\s*)"(?:[^"\\]|\\.)*"/gi
const redactBody = (body: string) => body.replace(SENSITIVE_BODY_VALUE, '$1"***"')

const redactUrl = (url: string) => url.replace(SENSITIVE_QUERY_PARAM, '$1***')

// Technical description of an error for pro users / support (see ErrorDetails).
export const getErrorDetails = (exception: any): string | undefined => {
  if (!exception) {
    return undefined
  }
  const lines: string[] = []
  lines.push(`${exception.name || 'Error'}: ${exception.message || ''}`)
  if (exception.status) {
    lines.push(`Status: ${exception.status}`)
  }
  if (exception.url) {
    lines.push(`${exception.method || 'GET'} ${redactUrl(String(exception.url))}`)
  }
  if (exception.data != null && exception.data !== '') {
    const body = isString(exception.data) ? exception.data : JSON.stringify(exception.data)
    lines.push(`Response: ${body && redactBody(body).substring(0, MAX_ERROR_BODY_LENGTH)}`)
  }
  return lines.join('\n')
}

// For the invitation surfaces (QR scan, invitation link, join screen):
// a CheckInException (unparseable code/link) or a 404 (regatta gone) both
// mean "this invitation is not valid", not a technical error.
export const getInvitationErrorMessage = (exception: any) => {
  if (exception && (exception.name === CheckInException.NAME || exception.status === STATUS_NOT_FOUND)) {
    return I18n.t(ErrorCodes.INVALID_INVITATION)
  }
  return getErrorDisplayMessage(exception)
}

export const getCaptionTranslationKey = (suffix: string) => `caption_${suffix}`

export const getTabItemTitleTranslation = (routeName: string) =>
  I18n.t(getCaptionTranslationKey(`tab_${routeName.toLowerCase()}`))
