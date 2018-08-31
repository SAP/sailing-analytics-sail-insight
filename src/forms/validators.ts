import I18n from 'i18n'


const REGEX_EMAIL_VALID = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateRequired = (value: any) =>
  value ? undefined : I18n.t('error_field_required')

export const validateEmail = (value: string) =>
  (REGEX_EMAIL_VALID.test(value) ? undefined : I18n.t('error_field_invalid_email'))
