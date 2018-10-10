import { includes, isString } from 'lodash'

import I18n from 'i18n'


// tslint:disable-next-line max-line-length
const REGEX_EMAIL_VALID = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateRequired = (value: any) =>
  value ? undefined : I18n.t('error_field_required')

export const validateEmail = (value: string) =>
  (REGEX_EMAIL_VALID.test(value) ? undefined : I18n.t('error_field_invalid_email'))

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
