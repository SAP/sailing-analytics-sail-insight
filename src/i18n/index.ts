import I18n from 'react-native-i18n'


export const SupportedLocales: any = {
  en: 'en',
  de: 'de',
}

I18n.fallbacks = true
I18n.translations = {
  [SupportedLocales.en]: require('./translations/en.json'),
  [SupportedLocales.de]: require('./translations/de.json'),
}

export default I18n
