import { renderFormattedMessage } from '../format'

declare const describe: any
declare const test: any
declare const expect: any

const locales = ['cs', 'da', 'de', 'en', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'sl', 'zh']
const translations: { [locale: string]: { [key: string]: string } } = {}
locales.forEach(locale => {
  translations[locale] = require(`../translations/${locale}.json`)
})

const render = (locale: string, key: string, boatName = '') =>
  renderFormattedMessage(translations[locale][key], {
    highlight: value => value,
    privacyPolicy: value => value,
    boatName: () => boatName,
  }).join('')

// Find markers automatically. Developers do not need to register sentence joins.
const formattedKeys = Object.keys(translations.en).filter(key =>
  /<highlight>|<privacyPolicy>|<boatName\/>/.test(translations.en[key]))

const usedMarkers = (message: string) => {
  const markers: string[] = []
  renderFormattedMessage(message, {
    highlight: value => {
      markers.push('highlight')
      return value
    },
    privacyPolicy: value => {
      markers.push('privacyPolicy')
      return value
    },
    boatName: () => {
      markers.push('boatName')
      return ''
    },
  })
  return markers.sort()
}

describe.each(locales)('%s', (locale: string) => {
  test('has the whole translated messages and the same formatting markers', () => {
    expect(translations[locale].text_join_with_boat_explainer).toBeTruthy()
    formattedKeys.forEach(key => {
      expect(translations[locale][key]).toBeTruthy()
      expect(usedMarkers(translations[locale][key])).toEqual(usedMarkers(translations.en[key]))
    })
  })
})

test('translations control word order and spacing', () => {
  expect(render('en', 'title_create_account')).toBe('Create Account')
  expect(render('de', 'title_create_account')).toBe('Konto erstellen')
  expect(render('ja', 'title_create_account')).toBe('作成アカウント')
  expect(render('zh', 'title_create_account')).toBe('创建账户')
  expect(render('ja', 'title_add_boat')).toBe('追加艇')
  expect(render('zh', 'text_join_with_boat_explainer')).toBe('访问账户设置以编辑此船只或新建船只。')
})

test('a boat name never changes translated spaces or punctuation', () => {
  for (const name of ['海風', 'Sea 風 Breeze', '<海風/>']) {
    expect(render('en', 'text_join_with_boat', name)).toBe(`You will join this race with ${name}.`)
    expect(render('de', 'text_join_with_boat', name)).toBe(`Du wirst diesem Event mit dem Boot ${name} beitreten.`)
    expect(render('ja', 'text_join_with_boat', name)).toBe(`このレースは${name}で参加することになります。`)
    expect(render('zh', 'text_join_with_boat', name)).toBe(`您将使用以下船只加入此轮比赛：${name}。`)
  }
})

test('the highlighted phrase and clickable policy marker stay in the message', () => {
  expect(usedMarkers(translations.en.title_add_boat)).toEqual(['highlight'])
  expect(usedMarkers(translations.de.title_add_boat)).toEqual(['highlight'])
  expect(usedMarkers(translations.en.text_register_privacy_policy)).toEqual(['privacyPolicy'])
  expect(usedMarkers(translations.ja.text_join_privacy_policy)).toEqual(['privacyPolicy'])
  let linkedText = ''
  const output = renderFormattedMessage(translations.zh.text_register_privacy_policy, {
    privacyPolicy: text => {
      linkedText = text
      return `[${text}]`
    },
  }).join('')
  expect(linkedText).toBe('隐私政策')
  expect(output).toBe('注册即表示您接受[隐私政策]')
})
