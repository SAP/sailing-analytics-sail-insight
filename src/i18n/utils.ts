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

// CJK ideographs, kana, CJK punctuation and full-width forms
const CJK_CHARACTER = /[　-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/

// Some sentences are rendered from several parts (e.g. to highlight one of
// them), and the translations carry the separating spaces at the joins like
// en.json does. Chinese and Japanese don't put spaces between words, so drop
// the spaces at a join where the text on either side is CJK.
export const joinableSentenceParts = (...parts: string[]) => {
  const result = [...parts]
  for (let i = 0; i < result.length - 1; i += 1) {
    const before = result[i].trimEnd()
    const after = result[i + 1].trimStart()
    if (CJK_CHARACTER.test(before.slice(-1)) || CJK_CHARACTER.test(after.charAt(0))) {
      result[i] = before
      result[i + 1] = after
    }
  }
  return result
}
