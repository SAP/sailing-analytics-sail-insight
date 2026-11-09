import { joinableSentenceParts } from '../utils'

declare var describe: any
declare var test: any
declare var expect: any

const locales = ['cs', 'da', 'de', 'en', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'sl', 'zh']
const translations: { [locale: string]: { [key: string]: string } } = {}
locales.forEach(locale => {
  translations[locale] = require(`../translations/${locale}.json`)
})

const splitSentences = [
  ['title_create_account_01', 'title_create_account_02', 'title_create_account_03'],
  ['title_add_boat_01', 'title_add_boat_02', 'title_add_boat_03'],
  ['text_join_with_boat_explainer_01', 'text_join_with_boat_explainer_02', 'text_join_with_boat_explainer_03'],
  ['text_register_grant_eula_01', 'text_register_grant_eula_03'],
  ['text_register_grant_eula_join_01', 'text_register_grant_eula_03'],
]

const partsOf = (locale: string, keys: string[]) =>
  keys.map(key => translations[locale][key] ?? translations.en[key])

test('keeps the spaces at joins of non-CJK text', () => {
  expect(joinableSentenceParts('Create ', 'Account', '')).toEqual(['Create ', 'Account', ''])
  expect(joinableSentenceParts('Visit the ', 'account settings', ' to edit this boat.'))
    .toEqual(['Visit the ', 'account settings', ' to edit this boat.'])
})

test('drops the spaces at joins next to CJK text', () => {
  expect(joinableSentenceParts('作成 ', 'アカウント', '')).toEqual(['作成', 'アカウント', ''])
  expect(joinableSentenceParts('访问 ', '账户设置', ' 以编辑此船只或新建船只。'))
    .toEqual(['访问', '账户设置', '以编辑此船只或新建船只。'])
  expect(joinableSentenceParts('このレースは ', 'Sea Breeze', 'で参加することになります。'))
    .toEqual(['このレースは', 'Sea Breeze', 'で参加することになります。'])
})

describe.each(locales.filter(locale => locale !== 'ja' && locale !== 'zh'))('%s', (locale: string) => {
  test('renders split sentences unchanged', () => {
    splitSentences.forEach(keys => {
      const parts = partsOf(locale, keys)
      expect(joinableSentenceParts(...parts)).toEqual(parts)
    })
  })
})

describe.each(['ja', 'zh'])('%s', (locale: string) => {
  test('renders split sentences without spaces at the joins', () => {
    splitSentences.forEach(keys => {
      const sentence = joinableSentenceParts(...partsOf(locale, keys)).join('')
      expect(sentence).not.toMatch(/ /)
    })
  })
})
