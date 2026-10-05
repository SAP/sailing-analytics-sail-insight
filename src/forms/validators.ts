import { includes, isString } from 'lodash'
import { defaultTo } from 'ramda'
import { isHandicapValid } from 'models/TeamTemplate'

import I18n from 'i18n'

// tslint:disable-next-line max-line-length
const REGEX_EMAIL_VALID = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const REGEX_SESSIONNAME_VALID = /^[^/\?\[\];"]{0,255}$/

// whitespace-only strings count as empty
const hasContent = (value: any) => isString(value) ? value.trim() !== '' : !!value

export const validateRequired = (value: any) =>
  hasContent(value) ? undefined : I18n.t('error_field_required')

export const validateRequiredWithErrorCode = (errorCode: string) => (value: any) =>
  hasContent(value) ? undefined : I18n.t(defaultTo('error_field_required', errorCode))

export const validateUsername = (value: any) =>
    value && value.length >= 3 ? undefined : I18n.t('error_field_invalid_username')

export const validatePassword = (value: any) =>
    value && value.length >= 5 ? undefined : I18n.t('error_field_invalid_password')

export const validateEmail = (value: string) =>
  (REGEX_EMAIL_VALID.test(value) ? undefined : I18n.t('error_field_invalid_email'))

export const validateSessionname = (value: string) =>
  (REGEX_SESSIONNAME_VALID.test(value) ? undefined : I18n.t('error_field_invalid_sessionname'))

export interface ComparisonValidatorViewProps {
  ignoredValue?: string
  comparisonValue?: string | string[]
}
// names are stored trimmed (see teamFromFormValues), so compare trimmed and
// case-insensitively; otherwise "Optimist " would silently replace "Optimist"
const normalizeName = (name: any) => isString(name) ? name.trim().toLowerCase() : name

export const validateNameExists = (value: string, cxt: any, viewProps: ComparisonValidatorViewProps = {}) => {
  const { ignoredValue, comparisonValue } = viewProps
  if (!comparisonValue) {
    return undefined
  }
  const name = normalizeName(value)
  if (ignoredValue && name === normalizeName(ignoredValue)) {
    return undefined
  }
  const existing = isString(comparisonValue) ? [comparisonValue] : comparisonValue
  return name && existing.some(candidate => normalizeName(candidate) === name) ?
     I18n.t('error_field_already_exists') :
     undefined
}

export const validateHandicap = (value: any) =>
  isHandicapValid(value) ? undefined : I18n.t('error_field_invalid_handicap')
