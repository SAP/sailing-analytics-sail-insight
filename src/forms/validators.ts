import { includes, isString } from 'lodash'
import { defaultTo } from 'ramda'
import I18n from 'i18n'

// tslint:disable-next-line max-line-length
const REGEX_EMAIL_VALID = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const REGEX_SESSIONNAME_VALID = /^[^/\?\[\];"]{0,255}$/

export const validateRequired = (value: any, errorCode?: string) =>
  value ? undefined : I18n.t(defaultTo('error_field_required', errorCode))

export const validateUsername = (value: any) =>
    value.length >= 3 ? undefined : I18n.t('error_field_invalid_username')

export const validatePassword = (value: any) =>
    value.length >= 5 ? undefined : I18n.t('error_field_invalid_password')

export const validateEmail = (value: string) =>
  (REGEX_EMAIL_VALID.test(value) ? undefined : I18n.t('error_field_invalid_email'))

export const validateSessionname = (value: string) =>
  (REGEX_SESSIONNAME_VALID.test(value) ? undefined : I18n.t('error_field_invalid_sessionname'))

export interface ComparisonValidatorViewProps {
  ignoredValue?: string
  comparisonValue?: string | string[]
}
export const validateNameExists = (value: string, cxt: any, viewProps: ComparisonValidatorViewProps = {}) => {
  const { ignoredValue, comparisonValue } = viewProps
  if (!viewProps.comparisonValue) {
    return undefined
  }
  if (ignoredValue && value === ignoredValue) {
    return undefined
  }
  return comparisonValue && value &&
    ((isString(comparisonValue) && comparisonValue === value) || includes(comparisonValue, value)) ?
     I18n.t('error_field_already_exists') :
     undefined
}
