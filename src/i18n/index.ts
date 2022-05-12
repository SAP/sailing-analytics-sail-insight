import I18n from 'react-native-i18n'


export const SupportedLocales: any = {
  da: 'da',
  de: 'de',
  en: 'en',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  sl: 'sl',
  zh: 'zh'
}

I18n.fallbacks = true
I18n.translations = {
  [SupportedLocales.da]: require('./translations/da.json'),
  [SupportedLocales.de]: require('./translations/de.json'),
  [SupportedLocales.en]: require('./translations/en.json'),
  [SupportedLocales.es]: require('./translations/es.json'),
  [SupportedLocales.fr]: require('./translations/fr.json'),
  [SupportedLocales.it]: require('./translations/it.json'),
  [SupportedLocales.pt]: require('./translations/pt.json'),
  [SupportedLocales.ru]: require('./translations/ru.json'),
  [SupportedLocales.sl]: require('./translations/sl.json'),
  [SupportedLocales.zh]: require('./translations/zh.json')
}

export default I18n
