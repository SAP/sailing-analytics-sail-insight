import { isNumber, keys } from 'lodash'

import I18n from 'i18n'


const PluralizationMode = {
  ONE: 'one',
  OTHER: 'other',
  ZERO: 'zero',
}

export const MISSING_PREFIX = '[missing'

export const pluralizationTranslation = (translationKey: string, values: any) => {
  const valueKeys = keys(values)
  if (!valueKeys) {
    return I18n.t(translationKey, values)
  }
  let mode
  // tslint:disable-next-line prefer-for-of
  for (let i = 0; i < valueKeys.length; i += 1) {
    const value = values[valueKeys[i]]
    if (isNumber(value)) {
      if (value === 0) {
        mode = PluralizationMode.ZERO
      } else if (value === 1) {
        mode = PluralizationMode.ONE
      } else {
        mode = PluralizationMode.OTHER
      }
      break
    }
  }
  if (!mode) {
    return I18n.t(translationKey, values)
  }
  return I18n.t(`${translationKey}__${mode}`, values)
}
